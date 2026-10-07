// Usage: sheet <in> <out.jpg> <start> <end> <step> <cols> <cellWidth> [cropX cropY cropW cropH]
// Timestamped contact sheet of frames (optionally cropped to a region of the source frame).
import AVFoundation
import AppKit

let a = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let (start, end, step) = (Double(a[3])!, Double(a[4])!, Double(a[5])!)
let cols = Int(a[6])!, cellW = Int(a[7])!
let crop: CGRect? = a.count > 11 ? CGRect(x: Double(a[8])!, y: Double(a[9])!, width: Double(a[10])!, height: Double(a[11])!) : nil

let gen = AVAssetImageGenerator(asset: asset)
gen.requestedTimeToleranceBefore = .zero
gen.requestedTimeToleranceAfter = .zero

var times: [Double] = []
var t = start
while t <= end + 0.0001 { times.append(t); t += step }

var frames: [CGImage] = []
for time in times {
  var img = try gen.copyCGImage(at: CMTime(seconds: time, preferredTimescale: 600), actualTime: nil)
  if let crop { img = img.cropping(to: crop)! }
  frames.append(img)
}
let aspect = Double(frames[0].height) / Double(frames[0].width)
let cellH = Int(Double(cellW) * aspect) + 22
let rows = (frames.count + cols - 1) / cols
let W = cols * cellW, H = rows * cellH

let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: W, pixelsHigh: H, bitsPerSample: 8, samplesPerPixel: 4,
                           hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
NSColor(white: 0.15, alpha: 1).setFill()
NSRect(x: 0, y: 0, width: W, height: H).fill()
let attrs: [NSAttributedString.Key: Any] = [.font: NSFont.monospacedSystemFont(ofSize: 15, weight: .bold), .foregroundColor: NSColor.yellow]
for (i, img) in frames.enumerated() {
  let x = (i % cols) * cellW
  let yTop = (i / cols) * cellH
  let imgH = cellH - 22
  let y = H - yTop - cellH  // AppKit origin is bottom-left
  NSGraphicsContext.current!.cgContext.draw(img, in: CGRect(x: x, y: y, width: cellW, height: imgH))
  String(format: "%.2fs", times[i]).draw(at: NSPoint(x: x + 4, y: y + imgH + 2), withAttributes: attrs)
}
NSGraphicsContext.restoreGraphicsState()
try rep.representation(using: .jpeg, properties: [.compressionFactor: 0.7])!.write(to: URL(fileURLWithPath: a[2]))
print(frames.count, "frames", W, "x", H)
