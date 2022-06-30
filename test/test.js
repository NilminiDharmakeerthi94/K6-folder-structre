

import * as productService from "../utility/testService.js";
import * as env from "../env.js";
import * as testData from "../testData/testData.js";

export let option = {
  vus: testData.VUS,
  duration: testData.DURATION,
  teardownTimeout: testData.TEARDOWNTIME, // if system has infinit loop , in cause of failer, function will get timeout
  thresholds: {
    errors: ["rate<0.1"], // i.e 10% error rate
  },
};

// init
let environment;
let token;

//add environment
if ("${__ENV.ENVIRONMENT}" == env.int) {
  environment = env.intEnvironment;
  token = "${__ENV.INT_TOKEN}";
} else if ("${__ENV.environment}" == env.dev) {
  environment = env.stgEnvironment;
  token = "${__ENV.STG_TOKEN}";
}
//4. Test life cycle set up
export function setUp() {
  // no set up
}
export default function () {
  try {
    //load product list
    productService.loadProductList("${environment.SERVER_ENDPOINT}", token);
   //call product work flow
   let responseBody = productService.createProduct(
      "${environment.SERVER_ENDPOINT}",
      token
    );
    productService.getProduct(
      "${environment.SERVER_ENDPOINT}",
      token,
      responseBody[0].id
    );
    productService.deleteProduct(
      "${environment.SERVER_ENDPOINT}",
      token,
      responseBody[0].id
    ); 
  } catch (ex) {
    console.log("Error occures in execution");
  } 
}
 