class A {
	constructor() {
		this.obj = {
			a: 'hello world'
		}
	}
	test() {
		this.obj.b = 'world hello'
		console.log("Yup")
	}
}

class B extends A {
	constructor() {
		super();
	}
	test() {
		console.log(this.obj);

	}
}

let a = new A();
a.test();

let b = new B();
b.test();