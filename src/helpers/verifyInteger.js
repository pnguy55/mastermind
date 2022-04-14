export default function verifyInteger(value, property) {
  if(isNaN(value)){
    throw new Error(`${property}: [${value}] is not a number and thus invalid.`);
  }
}