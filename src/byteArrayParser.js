/**
 * Internal helper functions common to parsing byte arrays of any type
 */

const fastGbk = require('fast-gbk');

window.fastGbk = fastGbk;

/**
 * Reads a string of 8-bit characters from an array of bytes and advances
 * the position by length bytes.  A null terminator will end the string
 * but will not effect advancement of the position.  Trailing and leading
 * spaces are preserved (not trimmed)
 * @param byteArray the byteArray to read from
 * @param position the position in the byte array to read from
 * @param length the maximum number of bytes to parse
 * @returns {string} the parsed string
 * @throws error if buffer overread would occur
 * @access private
 */
export function readFixedString (byteArray, position, length) {
  if (length < 0) {
    throw 'dicomParser.readFixedString - length cannot be less than 0';
  }

  if (position + length > byteArray.length) {
    throw 'dicomParser.readFixedString: attempt to read past end of buffer';
  }

  var result = '';
  var byte;

  for (var i = 0; i < length; i++) {
    byte = byteArray[position + i];
    if (byte === 0) {
      position += length;
      return result;
    }
    if (byte > 128) {
      result += fastGbk.decode([byte, byteArray[position + i + 1]]);
      i++;
    } else {
      result += String.fromCharCode(byte);
    }
  }

  return result;
}
