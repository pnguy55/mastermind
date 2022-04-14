'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RandomNumberDao {
  constructor() {}

  async fetch() {
    try {
      const response = await _axios2.default.get(`https://www.random.org/integers/?num=4&min=0&max=7&col=1&base=10&format=plain&rnd=new`);
      const numberCombination = response.data.split('\n').slice(0, 4).join('|');
      return numberCombination;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
exports.default = RandomNumberDao;
//# sourceMappingURL=RandomNumberDao.js.map