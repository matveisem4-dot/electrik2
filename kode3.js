// SYNAPSE ZERO Neural Core
class SynapseNet {
    constructor() {
        this.w = [Math.random(), Math.random()];
        this.b = Math.random();
        this.rate = 0.05;
    }

    activate(x) { return 1 / (1 + Math.exp(-x)); }

    think(inputs) {
        let sum = this.b;
        inputs.forEach((val, i) => sum += val * this.w[i]);
        return this.activate(sum);
    }

    learn(inputs, target) {
        let guess = this.think(inputs);
        let err = target - guess;
        this.w = this.w.map((w, i) => w + err * inputs[i] * this.rate);
        this.b += err * this.rate;
    }
}
