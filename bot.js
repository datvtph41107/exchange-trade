import http from "k6/http";
import { SharedArray } from "k6/data";

const ENDPOINT = "https://api-future.stt-ex.com/api/v1";
// const JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMDVhMjgzMzYzNjFhZWJkOGY1YzNlZjYwZTdlNTM0NjVkZGJlZGFjNjUzN2M3ZTIwOTlmMTkyNDVmZDIzYzVjYzdhZmE5YTU2Mjk4MmI3NDciLCJpYXQiOjE3MzAwODcwMzIuMjQ0Njg5LCJuYmYiOjE3MzAwODcwMzIuMjQ0NjkyLCJleHAiOjE3MzA0NDcwMzIuMjE5MzQ4LCJzdWIiOiIyOSIsInNjb3BlcyI6WyIqIl19.QgK0XWWCEYBY6Z7T5rARPwo01mzS-KSBZccFQ9_1G2c0YQaB2bEDbTFNNSe7MVnnn-rbiDFz3awu3srp5Ben2_CvtyZ6zmzxymOMwuAktrFlDhfbEA25bjpJ6BxjRYbvlABiC9rQzEyilQkVh0BG2N79uEymDv9NndhjGhCH4OTTcA-VoJxJtsive7NT1J7tuX7YuAJ4GiLr_4iXyOzQybqNXQKmLCrph--GOgPKIcgf3iP9x7ZGviU3zYJ4gQjCxIVkK_vlrvtAbJ7VgqBMI30G6K8vFopU1H25Gj1IS-meSxbUAewJGZogDX-OiRyjfm6x3W-N0mcs303iS8i8i5JXlyGcS8iDiWOgNNhaRvi8uCoEILiqpu5mp7ikUXrL7R2nmLzfCV4r8EMx5uj-CfLlm7VQvkkIqo0HlqRBmbmlWhl0yudVn5D9YD-Cjt5woeiVombgldnCkjT7D-41WeuS_yoAXaZMBX2lFDiZMMEUzNckd-3Jr9DV310ELEz9fxY1obbfhdB7Swoy2hecCrF2BPTB72pKNs4n6tDhlu-bMchSO01Zp5YvYaMt5-5VIKuv_nCAzZFOnemm_gkgk09G_BchuX76b406rTYF0aRyQGgyR_dhr6Dw6c4PherZOT9uOwMT09Lx0LdqwqQ3bwOzG4s3wGRLWX2HJCrHV_c';
const MARK_PRICE = "76191.92";
const TOKENS = new SharedArray("getTokens", function () {
    // All heavy work (opening and processing big files for example) should be done inside here.
    // This way it will happen only once and the result will be shared between all VUs, saving time and memory.
    const f = JSON.parse(open("./tokens.json"));
    return f; // f must be an array
});

export const options = {
    discardResponseBodies: true,
    scenarios: {
        warmup: {
            exec: "placeOrder",
            executor: "constant-arrival-rate",
            duration: "2s",
            rate: 1000,
            timeUnit: "1s",
            preAllocatedVUs: 1000,
            maxVUs: 4000,
        },
        loadTest: {
            exec: "placeOrder",
            executor: "constant-arrival-rate",
            duration: "60s",
            rate: 2500,
            timeUnit: "1s",
            preAllocatedVUs: 1000,
            maxVUs: 4000,
            startTime: "2s",
        },
    },
};

export function randomPrice(side) {
    const markPrice = parseFloat(MARK_PRICE);
    const range = (markPrice / 100) * 4;
    const minPrice = markPrice - range;
    const maxPrice = markPrice + range;

    let randomPrice = 0;
    if (side == "BUY") {
        randomPrice = minPrice + range * (Math.random() * 1.6 + 0.4);
    } else {
        randomPrice = minPrice + range * (Math.random() * 1.6);
    }

    return randomPrice.toFixed(2);
}

export function randomQuantity() {
    return parseFloat((Math.random() / 10 + 0.1).toFixed(3));
}

export function randomSide() {
    const sides = ["BUY", "SELL"];

    return sides[Math.floor(Math.random() * sides.length)];
}

export function randomType() {
    if (Math.random() < 0.97) {
        return "LIMIT";
    } else {
        return "MARKET";
    }
}

export function getRandomToken(tokens) {
    return tokens[Math.floor(Math.random() * tokens.length)];
}

export async function placeOrder() {
    const token = getRandomToken(TOKENS);
    const url = ENDPOINT + "/order";
    const bearerToken = `Bearer ${token}`;
    const options = {
        headers: {
            Authorization: bearerToken,
            "Content-Type": "application/json",
        },
    };

    const type = randomType();
    const side = randomSide();
    const requestBid = {
        side: side,
        symbol: "BTCUSDT",
        type: type,
        quantity: randomQuantity(),
        contractType: "USD_M",
        isPostOnly: false,
        isReduceOnly: false,
        asset: "USDT",
    };

    if (type == "LIMIT") {
        requestBid["price"] = randomPrice(side).toString();
    }

    const response = await http.post(url, JSON.stringify(requestBid), options);

    if (response.status !== 201) {
        console.error(`Failed to place order: ${response.status} - ${response.body}`);
        // console.log(requestBid);
    }
}
