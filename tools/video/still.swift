// Usage: still <in> <outDir> <outWidth> <name=seconds>...   (crops the letterbox, saves JPEGs)
//        still <in> --bars <seconds>                           (prints the picture rows)
import AVFoundation
import AppKit
let a = CommandLine.arguments
let gen = AVAssetImageGenerator(asset: AVURLAsset(url: URL(fileURLWithPath: a[1])))
gen.requestedTimeToleranceBefore = .zero; gen.requestedTimeToleranceAfter = .zero
func frame(_ t: Double) throws -> CGImage { try gen.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 600), actualTime: nil) }
func rowLuma(_ img: CGImage) -> [Double] {
  let ctx = CGContext(data: nil, width: img.width, height: img.height, bitsPerComponent: 8, bytesPerRow: img.width * 4,
                      space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  ctx.draw(img, in: CGRect(x: 0, y: 0, width: img.width, height: img.height))
  let p = ctx.data!.assumingMemoryBound(to: UInt8.self)
  return (0..<img.height).map { y in   // row 0 = top
    let row = img.height - 1 - y
    var s = 0.0
    for x in stride(from: 0, to: img.width, by: 8) { let i = (row * img.width + x) * 4; s += Double(p[i]) + Double(p[i + 1]) + Double(p[i + 2]) }
    return s / Double(img.width / 8) / 3
  }
}
if a[2] == "--bars" {
  let l = rowLuma(try frame(Double(a[3])!))
  let lit = l.indices.filter { l[$0] > 12 }
  print("first lit row", lit.first!, "last lit row", lit.last!)
  print(stride(from: 30, to: 120, by: 6).map { "\($0):\(Int(l[$0]))" }.joined(separator: " "))
  exit(0)
}
let outW = Double(a[3])!
let crop = CGRect(x: 0, y: 108, width: 1920, height: 864)
for spec in a.dropFirst(4) {
  let parts = spec.split(separator: "=")
  let img = try frame(Double(parts[1])!).cropping(to: crop)!
  let outH = (outW * crop.height / crop.width).rounded()
  let ctx = CGContext(data: nil, width: Int(outW), height: Int(outH), bitsPerComponent: 8, bytesPerRow: 0,
                      space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  ctx.interpolationQuality = .high
  ctx.draw(img, in: CGRect(x: 0, y: 0, width: outW, height: outH))
  let rep = NSBitmapImageRep(cgImage: ctx.makeImage()!)
  let url = URL(fileURLWithPath: a[2]).appendingPathComponent("\(parts[0]).jpg")
  try rep.representation(using: .jpeg, properties: [.compressionFactor: 0.72])!.write(to: url)
  print(parts[0], Int(outW), "x", Int(outH))
}
