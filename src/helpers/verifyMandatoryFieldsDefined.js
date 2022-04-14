export default function verify(obj, mandatoryPropertyNames){
  
  const undefinedList = [];

  for(const propertyName of mandatoryPropertyNames) {
    if(obj[propertyName] === undefined) {
      undefinedList.push(propertyName);
    }
  }

  const numOfUndefined = undefinedList.length;

  if(numOfUndefined > 0) {
    throw new Error(`The following arguments: [${undefinedList}] are undefined.`)
  }
}