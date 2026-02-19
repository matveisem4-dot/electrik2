// AETERNA QUANTUM Core
class Qubit {
    constructor() {
        this.alpha = { re: 1, im: 0 }; 
        this.beta = { re: 0, im: 0 };
    }

    hadamard() {
        const factor = 1 / Math.sqrt(2);
        const newAlpha = { re: factor * (this.alpha.re + this.beta.re), im: factor * (this.alpha.im + this.beta.im) };
        const newBeta = { re: factor * (this.alpha.re - this.beta.re), im: factor * (this.alpha.im - this.beta.im) };
        this.alpha = newAlpha;
        this.beta = newBeta;
    }

    measure() {
        const prob0 = Math.pow(this.alpha.re, 2) + Math.pow(this.alpha.im, 2);
        const result = Math.random() < prob0 ? 0 : 1;
        this.alpha = result === 0 ? { re: 1, im: 0 } : { re: 0, im: 0 };
        this.beta = result === 1 ? { re: 1, im: 0 } : { re: 0, im: 0 };
        return result;
    }
}
