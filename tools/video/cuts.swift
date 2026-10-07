// Prints source times where the bottom-right label region changes (frame-accurate).
import AVFoundation
let asset = AVURLAsset(url: URL(fileURLWithPath: CommandLine.arguments[1]))
let reader = try AVAssetReader(asset: asset)
var track: AVAssetTrack?
let s = DispatchSemaphore(value: 0)
Task { track = try? await asset.loadTracks(withMediaType: .video).first; s.signal() }
s.wait()
let out = AVAssetReaderTrackOutput(track: track!, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
reader.add(out)
reader.timeRange = CMTimeRange(start: CMTime(seconds: 7.0, preferredTimescale: 600), duration: CMTime(seconds: 31, preferredTimescale: 600))
reader.startReading()
// Label region (source pixels): x 1280..1920, y 990..1070 (bottom letterbox bar).
var prev: [UInt8]? = nil
var prevLit = false
while let buf = out.copyNextSampleBuffer(), let px = CMSampleBufferGetImageBuffer(buf) {
  let t = CMSampleBufferGetPresentationTimeStamp(buf).seconds
  CVPixelBufferLockBaseAddress(px, .readOnly)
  let base = CVPixelBufferGetBaseAddress(px)!.assumingMemoryBound(to: UInt8.self)
  let bpr = CVPixelBufferGetBytesPerRow(px)
  var sig = [UInt8](); var lit = 0
  for y in stride(from: 990, to: 1070, by: 4) { for x in stride(from: 1280, to: 1920, by: 4) {
    let v = base[y * bpr + x * 4 + 1]; sig.append(v > 128 ? 1 : 0); if v > 128 { lit += 1 } } }
  CVPixelBufferUnlockBaseAddress(px, .readOnly)
  if let p = prev {
    let diff = zip(p, sig).filter { $0 != $1 }.count
    if diff > 40 { print(String(format: "%.3f  diff=%d lit=%d", t, diff, lit)) }
  }
  prev = sig; prevLit = lit > 0
}
