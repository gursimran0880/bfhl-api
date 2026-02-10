const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const EMAIL = "gursimran3827.beai23@chitkara.edu.in";
const ROLL_NUMBER = "2310993827"; 
// AI Setup (Google Gemini)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- HELPER FUNCTIONS ---

// 1. Fibonacci
const getFibonacci = (n) => {
    if (typeof n !== 'number' || n < 0) return null;
    if (n === 0) return [];
    if (n === 1) return [0];
    let seq = [0, 1];
    while (seq.length < n) {
        seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
    }
    return seq;
};

// 2. Prime Checker
const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// 3. GCD (HCF)
const getGCD = (a, b) => (b === 0 ? a : getGCD(b, a % b));

// 4. LCM
const getLCM = (a, b) => {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / getGCD(a, b);
};

// --- ROUTES ---

// GET /health
app.get('/health', (req, res) => {
    res.json({
        is_success: true,
        official_email: EMAIL
    });
});

// POST /bfhl
app.post('/bfhl', async (req, res) => {
    const { fibonacci, prime, lcm, hcf, AI } = req.body;
    let data = null;

    try {
        // Logic Selector
        if (fibonacci !== undefined) {
            // Validate Integer
            const n = parseInt(fibonacci);
            if (isNaN(n)) throw new Error("Invalid input for fibonacci");
            data = getFibonacci(n);
        } 
        else if (prime !== undefined) {
            // Validate Array
            if (!Array.isArray(prime)) throw new Error("Input must be an array");
            data = prime.filter(num => Number.isInteger(num) && isPrime(num));
        } 
        else if (lcm !== undefined) {
             // Validate Array
            if (!Array.isArray(lcm) || lcm.length === 0) throw new Error("Input must be a non-empty array");
            let result = lcm[0];
            for (let i = 1; i < lcm.length; i++) {
                result = getLCM(result, lcm[i]);
            }
            data = result;
        } 
        else if (hcf !== undefined) {
             // Validate Array
            if (!Array.isArray(hcf) || hcf.length === 0) throw new Error("Input must be a non-empty array");
            let result = hcf[0];
            for (let i = 1; i < hcf.length; i++) {
                result = getGCD(result, hcf[i]);
            }
            data = result;
        } 
        else if (AI !== undefined) {
            // AI Integration
            if (!process.env.GEMINI_API_KEY) {
                data = "AI_KEY_MISSING";
            } else {

const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });                const prompt = `Answer the following question with exactly one word. Question: ${AI}`;
                const result = await model.generateContent(prompt);
                const response = await result.response;
                data = response.text().trim();
            }
        } 
        else {
            return res.status(400).json({
                is_success: false,
                official_email: EMAIL,
                message: "No valid key found (fibonacci, prime, lcm, hcf, AI)"
            });
        }

        // Success Response
        res.json({
            is_success: true,
            official_email: EMAIL,
            data: data
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            is_success: false,
            official_email: EMAIL,
            message: error.message || "An error occurred"
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});