import verify from '../helpers/verifyMandatoryFieldsDefined';
import verifyInteger from '../helpers/verifyInteger';
import RandomNumberDao from '../data/RandomNumberDao';

export default class RandomNumberController {
	constructor() {
		this.randomNumberDao = new RandomNumberDao();
	}

	async fetch(req, res) {

		// fetch randomNumber combination
		try {
			const randomNumberFetchResult = await this.randomNumberDao.fetch();
			if(randomNumberFetchResult !== undefined) {			
				res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(randomNumberFetchResult, null, 2));
			}
		} catch(err){
			res.status(404).send({
				message: err.message,
			});
		}
	}

}
