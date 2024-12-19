export class Serializer {

    private _symbolsArray: string[];

    private readonly ASCII_LAST_INDEX = 127;

    private readonly SEPARATOR = String.fromCharCode(this.ASCII_LAST_INDEX);

    constructor() {
        this._symbolsArray = [];
    }

    private get symbolsArray(): string[] {
        if (!this._symbolsArray.length) {
            const symbolsArray: string[] = [];
            for (let i = 0; i <= this.ASCII_LAST_INDEX - 1; i++) {
                symbolsArray.push(String.fromCharCode(i));
            }
            this.symbolsArray = symbolsArray;
        }
        return this._symbolsArray;
    }

    private set symbolsArray(value: string[]) {
        this._symbolsArray = value;
    }

    private encodeValue(number: number) {
        const symbolsArray = this.symbolsArray;
        if (typeof symbolsArray[number] === 'string') {
            return symbolsArray[number];
        }
        let result = "";
        while (number > 0) {
            result = symbolsArray[number % symbolsArray.length] + result;
            number = parseInt("" + number / symbolsArray.length);
        }
        return result;
    }

    public getRandom(arrayLength: number, min: number, max: number) {
        return Array.from({length: arrayLength}, () =>
            Math.floor(Math.random() * (max - min + 1)) + min
        );
    }

    public getString(arrayValues: number[]) {
        const result: string[] = [];
        arrayValues.forEach((value) => {
            result.push(this.encodeValue(value));
        });
        return result.join(this.SEPARATOR);
    }

    private decodeValue(baseValue: string) {
        const digits = this.symbolsArray.join("");
        let result = 0;
        let power = 1;
        for (let i = baseValue.length - 1; i >= 0; i--) {
            const digit = baseValue[i];
            const digitValue = digits.indexOf(digit);
            result += digitValue * power;
            power *= this.symbolsArray.length;
        }
        return result;
    }

    public decode(value: string) {
        const decodeArray = value.split(this.SEPARATOR);
        const decodeResult: number[] = [];
        decodeArray.forEach((value) => {
            decodeResult.push(this.decodeValue(value));
        });
        return decodeResult;
    }
}
