import axios from 'axios'

export default class RandomNumberDao {
	constructor() {
	}
  
  async fetch(){
    try {
      const response = await axios.get(`https://www.random.org/integers/?num=4&min=0&max=7&col=1&base=10&format=plain&rnd=new`);
      const numberCombination = response.data.split('\n').slice(0,4).join('|');
      return numberCombination;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}