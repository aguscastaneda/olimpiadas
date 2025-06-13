class Utilities {

  static async sleep(seconds) {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(resolve, seconds * 1000)
      } catch (e) {
        reject(e)
      }
    })
  }

  static random(max) {
    return Math.floor(Math.random() * max)
  }

  static createArray(length) {
    return Array.from({ length }, (value, index) => index)
  }

  static stringIsNumber(str) {
    return !isNaN(parseInt(str))
  }

  static formatNumberToPrice(n) {
    let numStr = n.toString();
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

export default Utilities