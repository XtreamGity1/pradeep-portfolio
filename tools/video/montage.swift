// Usage: montage <out.jpg> <cols> <cellWidth> <img>...
import AppKit
let a = CommandLine.arguments
let cols = Int(a[2])!, cw = Double(a[3])!
let imgs = a.dropFirst(4).map { NSImage(contentsOfFile: $0)!.cgImage(forProposedRect: nil, context: nil, hints: nil)! }
let ch = cw * Double(imgs[0].height) / Double(imgs[0].width)
let rows = (imgs.count + cols - 1) / cols
let W = Int(cw) * cols, H = Int(ch) * rows
let ctx = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
for (i, img) in imgs.enumerated() {
  ctx.draw(img, in: CGRect(x: Double(i % cols) * cw, y: Double(H) - Double(i / cols + 1) * ch, width: cw, height: ch))
}
try NSBitmapImageRep(cgImage: ctx.makeImage()!).representation(using: .jpeg, properties: [.compressionFactor: 0.7])!.write(to: URL(fileURLWithPath: a[1]))
