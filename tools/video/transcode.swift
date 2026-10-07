// Usage: transcode <in> <out> <width> <height> <videoBitsPerSecond> <audio:0|1> [startSeconds durationSeconds]
// H.264 High + optional AAC, metadata up front for progressive playback on the web.
import AVFoundation

let args = CommandLine.arguments
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])
let width = Int(args[3])!, height = Int(args[4])!
let bitrate = Int(args[5])!
let withAudio = args[6] == "1"
let range: CMTimeRange? = args.count > 8
  ? CMTimeRange(start: CMTime(seconds: Double(args[7])!, preferredTimescale: 600), duration: CMTime(seconds: Double(args[8])!, preferredTimescale: 600))
  : nil
try? FileManager.default.removeItem(at: output)

let asset = AVURLAsset(url: input)
let reader = try AVAssetReader(asset: asset)
let writer = try AVAssetWriter(outputURL: output, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true

let sema = DispatchSemaphore(value: 0)
var videoTrack: AVAssetTrack?
var audioTrack: AVAssetTrack?
Task {
  videoTrack = try await asset.loadTracks(withMediaType: .video).first
  audioTrack = try await asset.loadTracks(withMediaType: .audio).first
  sema.signal()
}
sema.wait()

let videoOut = AVAssetReaderTrackOutput(track: videoTrack!, outputSettings: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange,
])
reader.add(videoOut)
let videoIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: width,
  AVVideoHeightKey: height,
  AVVideoScalingModeKey: AVVideoScalingModeResizeAspectFill,
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: bitrate,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
    AVVideoMaxKeyFrameIntervalKey: 60,
  ],
])
videoIn.expectsMediaDataInRealTime = false
writer.add(videoIn)

var audioOut: AVAssetReaderTrackOutput?
var audioIn: AVAssetWriterInput?
if withAudio, let track = audioTrack {
  let out = AVAssetReaderTrackOutput(track: track, outputSettings: [AVFormatIDKey: kAudioFormatLinearPCM])
  reader.add(out)
  let inp = AVAssetWriterInput(mediaType: .audio, outputSettings: [
    AVFormatIDKey: kAudioFormatMPEG4AAC,
    AVNumberOfChannelsKey: 2,
    AVSampleRateKey: 44100,
    AVEncoderBitRateKey: 128_000,
  ])
  writer.add(inp)
  audioOut = out
  audioIn = inp
}

if let range { reader.timeRange = range }
reader.startReading()
writer.startWriting()
writer.startSession(atSourceTime: range?.start ?? .zero)

let group = DispatchGroup()
func pump(_ out: AVAssetReaderTrackOutput, _ inp: AVAssetWriterInput, _ label: String) {
  group.enter()
  inp.requestMediaDataWhenReady(on: DispatchQueue(label: label)) {
    while inp.isReadyForMoreMediaData {
      if let sample = out.copyNextSampleBuffer() {
        inp.append(sample)
      } else {
        inp.markAsFinished()
        group.leave()
        return
      }
    }
  }
}
pump(videoOut, videoIn, "video")
if let out = audioOut, let inp = audioIn { pump(out, inp, "audio") }
group.wait()

let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
if writer.status != .completed {
  print("failed:", writer.error ?? reader.error ?? "unknown")
  exit(1)
}
print("ok", output.path)
