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

const fetchNumbers = async (type) => {
    try {
        const response = await axios.get(testServerUrls[type], { timeout: 500 });
        return response.data.numbers;
    } catch (error) {
        console.error('Error fetching numbers:', error);
        return [];
    }
};

const updateWindow = (numbers) => {
    const uniqueNumbers = [...new Set(numbers)];
    numberWindow = [...numberWindow, ...uniqueNumbers];

    if (numberWindow.length > windowSize) {
        numberWindow = numberWindow.slice(numberWindow.length - windowSize);
    }

    return numberWindow;
};

const calculateAverage = (numbers) => {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return numbers.length ? (sum / numbers.length).toFixed(2) : 0;
};

app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    const prevState = [...numberWindow];

    if (!testServerUrls[numberid]) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    const numbers = await fetchNumbers(numberid);
    const currState = updateWindow(numbers);
    const average = calculateAverage(currState);

    res.json({
        numbers,
        windowPrevState: prevState,
        windowCurrState: currState,
        avg: average
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
