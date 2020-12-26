function GBK (codes) {
  codes = codes || require('./gbkCodes');
  var arr_index = 0x8140; // 33088;


  return {
    decode (arr) {
      var str = '';

      for (var n = 0, max = arr.length; n < max; n++) {
        var code = arr[n];

        if (code & 0x80) {
          code = codes[(code << 8 | arr[++n]) - arr_index];
        }
        str += String.fromCharCode(code);
      }

      return str;
    },
    encode (str) {
      str = String(str);
      var gbk = [];
      var wh = '?'.charCodeAt(0);

      for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);

        if (charcode < 0x80) {
          gbk.push(charcode);
        } else {
          var gcode = codes.indexOf(charcode);

          if (~gcode) {
            gcode += arr_index;
            gbk.push(0xFF & (gcode >> 8), 0xFF & gcode);
          } else {
            gbk.push(wh);
          }
        }
      }

      return gbk;
    }
  };
}

var gbk;
const createOrReuseInstance = () => {
  if (!gbk) {
    gbk = GBK();
  }

  return gbk;
};

Object.defineProperties(GBK, {
  encode: {
    get () {
      const gbk = createOrReuseInstance();


      return gbk.encode;
    }
  },
  decode: {
    get () {
      const gbk = createOrReuseInstance();


      return gbk.decode;
    }
  }
});

module.exports = GBK;
