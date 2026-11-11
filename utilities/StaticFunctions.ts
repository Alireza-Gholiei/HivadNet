export class StaticFunctions {
	public static checkNullOrEmptyOrUndefined(obj: any) {
		let result = true;

		if (obj === null || obj === undefined || obj === "") result = false;

		return result;
	}

	public static CheckMeliCode(_meli_code: number): boolean {
		const meli_code = _meli_code.toString();
		let c;
		let n;
		let r;

		if (meli_code.length === 10) {
			if (
				meli_code === "1111111111" ||
				meli_code === "0000000000" ||
				meli_code === "2222222222" ||
				meli_code === "3333333333" ||
				meli_code === "4444444444" ||
				meli_code === "5555555555" ||
				meli_code === "6666666666" ||
				meli_code === "7777777777" ||
				meli_code === "8888888888" ||
				meli_code === "9999999999" ||
				meli_code === "0123456789"
			) {
				return false;
			}
			c = parseInt(meli_code.charAt(9));
			n =
				parseInt(meli_code.charAt(0)) * 10 +
				parseInt(meli_code.charAt(1)) * 9 +
				parseInt(meli_code.charAt(2)) * 8 +
				parseInt(meli_code.charAt(3)) * 7 +
				parseInt(meli_code.charAt(4)) * 6 +
				parseInt(meli_code.charAt(5)) * 5 +
				parseInt(meli_code.charAt(6)) * 4 +
				parseInt(meli_code.charAt(7)) * 3 +
				parseInt(meli_code.charAt(8)) * 2;
			r = n - parseInt((n / 11).toString()) * 11;
			if ((r === 0 && r === c) || (r === 1 && c === 1) || (r > 1 && c === 11 - r)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	public static PadLeft(num: string, size: number, operator: string) {
		let s = num + "";
		while (s.length < size) {
			s = operator + s;
		}
		return s;
	}
}

export function restrict_special_char(event: any) {
	const k = event.charCode;

	return (
		(k >= 64 && k < 91) ||
		(k > 96 && k < 123) ||
		k === 8 ||
		k === 32 ||
		(k >= 48 && k <= 57) ||
		(k >= 1570 && k <= 1740) ||
		k === 46
	);
}

export function PipeDecimal(Event: number, PipeChar: string): number {
	return parseInt(Event.toString().split(PipeChar).join(""));
}
