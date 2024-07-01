const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;
const windowSize = 10;

let numberWindow = [];

const testServerUrls = {
    p: 'http://20.244.56.144/test/primes',
    f: 'http://20.244.56.144/test/fibo',
    e: 'http://20.244.56.144/test/even',
    r: 'http://20.244.56.144/test/rand'
};

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE5ODEyODQzLCJpYXQiOjE3MTk4MTI1NDMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImFhZWJlNjdlLTdjZmYtNDlmYS05NjE4LWU1M2ZjYjQyNjllMyIsInN1YiI6Im5pcmFqZ29wYWxwdXI1MUBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJNYWhhcmlzaGkgTWFya2FuZGVzaHdhciBFbmdpbmVlcmluZyBDb2xsZWdlIEFtYmFsYSIsImNsaWVudElEIjoiYWFlYmU2N2UtN2NmZi00OWZhLTk2MTgtZTUzZmNiNDI2OWUzIiwiY2xpZW50U2VjcmV0IjoiV3lXQ2JEWmlFZ1l6a3dpayIsIm93bmVyTmFtZSI6Ik5pcmFqIEt1bWFyIiwib3duZXJFbWFpbCI6Im5pcmFqZ29wYWxwdXI1MUBnbWFpbC5jb20iLCJyb2xsTm8iOiIxMTIxMjY4MiJ9.j4mMoXg092QP1n2XqdV8XkjN5rAcv1qKxMYbOnyg1cw";

const fetchNumbers = async (url) => {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: AUTH_TOKEN
            },
            timeout: 500
        });
        return response.data.numbers;
    } catch (error) {
        console.error(`Error fetching numbers: ${error.message}`);
        return [];
    }
};

app.get('/numbers/:numberid', async (req, res) => {
    const numberType = req.params.numberid;
    const url = testServerUrls[numberType];

    if (!url) {
        return res.status(400).json({ error: 'Invalid number type' });
    }

    const numbers = await fetchNumbers(url);

    const windowPrevState = [...numberWindow];

    numbers.forEach(number => {
        if (!numberWindow.includes(number)) {
            if (numberWindow.length >= windowSize) {
                numberWindow.shift();
            }
            numberWindow.push(number);
        }
    });

    const windowCurrState = [...numberWindow];
    const avg = numberWindow.reduce((sum, num) => sum + num, 0) / numberWindow.length;

    res.json({
        numbers,
        windowPrevState,
        windowCurrState,
        avg: parseFloat(avg.toFixed(2))
    });
});

app.listen(port, () => {
    console.log(`Average Calculator HTTP Microservice running on port ${port}`);
});
