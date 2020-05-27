'use strict'
import Exif from 'exif-js'

const IMAGE = {}


/**
 * 图片预加载
 * @param {*} src
 * @param {*} origin
 */
IMAGE.preload = (src, origin = null) => {
  let img = new Image()

  if (origin !== null) {
    img.crossOrigin = origin
  }

  img.src = src
}

/**
 * 图片预加载
 * @param {*} src
 * @param {*} origin
 */
IMAGE.preload = (src, origin = null) => {
  const img = new Image()

  if (origin !== null) {
    img.crossOrigin = origin
  }

  img.src = src
}

/**
 * 把图片方向扭正
 * Exif.js 提供了 JavaScript 读取图像的原始数据的功能扩展，例如：拍照方向、相机设备型号、拍摄时间、ISO 感光度、GPS 地理位置等数据。
 * @param {*} src 图片资源
 */
IMAGE.fixOrientation = (src) => {
  const $img = document.createElement('img')
  $img.src = src

  return new Promise((resolve, reject) => {
    try {
      $img.onload = () => {
        Exif.getData($img, () => {
          const orientation = Exif.getTag($img, 'Orientation')
          console.info('image orientation', orientation)

          if (orientation !== undefined && orientation !== 1) {
            switch (orientation) {
              // 顺时针90度
              case 6:
                IMAGE.rotateImg($img.src, 'right')
                  .then((base64) => {
                    resolve(base64)
                  })
                break
              // 逆时针90度
              case 8:
                IMAGE.rotateImg($img.src, 'left')
                  .then((base64) => {
                    resolve(base64)
                  })
                break
              // 180度
              case 3:
                IMAGE.rotateImg($img.src, 'left')
                  .then((base64) => {
                    IMAGE.rotateImg(base64, 'left')
                      .then((base64) => {
                        resolve(base64)
                      })
                  })
                break
              default:
                resolve($img.src)
                break
            }
          } else {
            resolve($img.src)
          }
        })
      }
      $img.src = src
    } catch (e) {
      console.warn('IMAGE.exifRotate exception', e)
      reject(e)
    }
  })
}

/**
 * 压缩图片
 * @param {*} src 图片资源
 * @param {*} maxWidth 最大宽度
 * @param {*} maxHeight 最大高度
 * @param {*} mime 类型
 */
IMAGE.compress = (src, maxWidth = 1100, maxHeight = 1100, mime = 'jpeg') => new Promise((resolve, reject) => {
  // 压缩图片需要的一些元素和对象
  const img = new Image()

  // 缩放图片需要的canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  img.src = src
  // base64地址图片加载完毕后
  // eslint-disable-next-line func-names
  img.onload = function () {
    // 图片原始尺寸
    const originWidth = this.width
    const originHeight = this.height

    // 目标尺寸
    let targetWidth = originWidth
    let targetHeight = originHeight
    // // 图片尺寸超过1000x1000的限制
    if (originWidth > maxWidth || originHeight > maxHeight) {
      if (originWidth / originHeight > maxWidth / maxHeight) {
        // 更宽，按照宽度限定尺寸
        targetWidth = maxWidth
        targetHeight = Math.round(maxWidth * (originHeight / originWidth))
      } else {
        targetHeight = maxHeight
        targetWidth = Math.round(maxHeight * (originWidth / originHeight))
      }
    }

    // canvas对图片进行缩放
    canvas.width = targetWidth
    canvas.height = targetHeight
    // 清除画布
    ctx.clearRect(0, 0, targetWidth, targetHeight)
    // 如果是横向图片，直接压缩压缩
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
    const base64 = canvas.toDataURL('image/' + mime, 0.8)
    resolve(base64)
  }
})

/**
 * 旋转图片
 * @param {*} src 图片资源
 * @param {*} direction 方向
 */
IMAGE.rotateImg = (src, direction) => new Promise((resolve, reject) => {
  const minStep = 0
  const maxStep = 3
  const canvas = document.createElement('canvas')
  const img = new Image()
  img.onload = () => {
    try {
      const height = img.height
      const width = img.width
      let step = minStep

      if (direction === 'right') {
        step++
        step > maxStep && (step = minStep)
      } else {
        step--
        step < minStep && (step = maxStep)
      }

      console.info('rotate step', step)

      const degree = step * 90 * Math.PI / 180
      const ctx = canvas.getContext('2d')
      switch (step) {
        case 0:
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0)
          break
        case 1:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, 0, -height)
          break
        case 2:
          canvas.width = width
          canvas.height = height
          ctx.rotate(degree)
          ctx.drawImage(img, -width, -height)
          break
        case 3:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, -width, 0)
          break
        default:
          break
      }

      const base64 = canvas.toDataURL('image/jpeg', 0.8)
      resolve(base64)
    } catch (e) {
      console.warn('IMAGE.rotateImg exception', e)
      reject(e)
    }
  }
  img.src = src
})

export default IMAGE
