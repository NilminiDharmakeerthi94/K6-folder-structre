import { check } from "k6";
import { Rate } from "k6/metrics";
import http from "k6/http";
import { Trend } from "k6/metrics";

//check failure rate
let failureRate = new Rate("failure_rate");

//define trends ->
var loadProductListTrend = new Trend("Trend_Load_Product_List");


// implement logger
export default function logger(endPoint, token, response) {
  console.log(`Logger Started VU =${__VU} ITER=${__ITER}`);
  console.log(
    `Endpoint is ${endPoint} token is ${token} VU =${__VU} ITER=${__ITER}`
  );
  console.log(
    `Response Status is ${response.status} VU =${__VU} ITER=${__ITER}`
  );
  console.log(`Body is $(JSON.stringify(JSON.parse(response.body)))`);

  try {
    // add correlation id
    console.log(
      `Correlation Id is ${
        JSON.stringify(JSON.parse(response.headers))["X-Correlation-Id"]
      }`
    );
  } catch (ex) {}
}


//separate function for header
export const setHeader = () => {
  return {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  };
};
//declare const for url

export const route_loadProductList = (endPoint, token) =>
  `${endPoint}?wstoken=${token}`; // add product list API


//load product list
export function loadProductList(endPoint, token) {
  console.log("Load product List");
  postResponse = http.post(
    "${route_loadProductList(endpoint,token)}",
    null,
    setHeader()
  );

  //add trend
  loadProductListTrend.add(postResponse.timings.duration);

  //add check
  checkPostResponse = check(postResponse, {
    "Product list load status 200: ": (r) => r.status === 200,
  });
  // Error rate

  failureRate.add(!checkPostResponse);

  //add logs
  logger(endPoint, token, postResponse);

  try {
  } catch (ex) {}
}



