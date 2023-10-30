export const lengths = {
  qvga: {
    width: 320,
    height: 240,
  },
  vga: {
    width: 640,
    height: 480,
  },
  hd: {
    width: 1280,
    height: 720,
  },
} as const

export const types = {
  webm: {
    codec: 'vp09.00.10.08',
    pt: 4,
    hardwareAcceleration: 'prefer-software',
  },
  mp4: {
    codec: 'avc1.42002A',
    pt: 1,
    hardwareAcceleration: 'prefer-hardware',
    avc: { format: 'annexb' },
  },
} as const

export const getEncoderConfig = (
  length: 'qvga' | 'vga' | 'hd',
  type: 'webm' | 'mp4',
) => ({
  bitrate: 10e6,
  ...lengths[length],
  ...types[type],
})

type EncoderConfig = ReturnType<typeof getEncoderConfig>

export const getWebmWriterConfig = (encoderConfig: EncoderConfig) => ({
  codec: 'VP9',
  width: encoderConfig.width,
  height: encoderConfig.height,
  bitrate: encoderConfig.bitrate,
})
