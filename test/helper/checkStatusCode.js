export default function checkStatusCode(res, expectedStatus = 200) {
  if (res.status === expectedStatus) {
    return res
  };
  const reqData = JSON.parse(JSON.stringify(res)).req;
  throw new Error(` 
  request-method  : ${JSON.stringify(reqData.method)} 
  request-url     : ${JSON.stringify(reqData.url)}
  request-data    : ${JSON.stringify(reqData.data)}
  request-headers : ${JSON.stringify(reqData.headers)}
  response-status  : ${JSON.stringify(res.status)}
  response-body    : ${JSON.stringify(res.body)}
  `
  );
};