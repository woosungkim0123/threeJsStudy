import * as THREE from "../build/three.module.js";

class App {
	constructor() {
		// _필드나 메서드는 App클래스 내부에서만 사용하는 private 필드, 메서드
		// private성격을 부여할 수 있는 기능이없지만 대신 밑줄로 시작함으로써 개발자 간에 약속
		// 정의한 이유 : 다른 메서드에서 참조할 수 있도록 하기 위함
		const divContainer = document.querySelector("#webgl-container");
		this._divContainer = divContainer;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		// antialias 활성화시 3차원 렌더링시 object들의 경계선이 계단 현상없이 부드럽게 표현됨
		renderer.setPixelRatio(window.devicePixelRatio);
		// 디스플레이의 배율 및 레이아웃 항목에 150%(권장) 으로 되어 있으면 1.5값을 가짐
		divContainer.appendChild(renderer.domElement);
		// renderer.domElement는 캔버스 타입의 돔 객체
		this._renderer = renderer;

		const scene = new THREE.Scene();
		this._scene = scene;

		this._setupCamera();
		this._setupLight();
		this._setupModel();
		// 창크기 변경
		// 카메라는 창 크기가 변경될때마다 속성값을 재 설정해줘야함
		// bind 사용이유 resize 메서드 안에서 this가 가르키는 객체가 이벤트 객체가 아닌 App 클래스의 객체가 되도록 하기위함

		window.onresize = this.resize.bind(this);
		// 생성자에서 한번 무조건적으로 호출해주고있는데 이렇게 함으로써 render나 카메라의 속성을 창크기에 맞게 설정해줌
		this.resize();
		// requestAnimation api에 넘겨서 호출하고 있음
		// render 메서드는 3차원 그래픽 장면을 만들어주는 메서드, 이 메서드를 requestAnimation에 넘겨줌으로써 적당한 시점(최대한빠르게)에 render메서드를 호출해주게됨
		// bind 사용이유 : render메서드 안에 쓰이는 this가 app클래스의 객체를 가리키도록 하기 위함
		requestAnimationFrame(this.render.bind(this));
	}
	// three.js가 3차원그래픽을 출력할 영역에 대한 가로와 세로 크기를 얻어와서 크기를 이용해서 카메라 객체를 생성
	_setupCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.getWorldPosition.z = 2;
		// 카메라 객체를 또 다른 메서드에서 사용할 수 있도록 this._camera라는 필드 객체로 정의
		this._camera = camera;
	}
	// 광원
	_setupLight() {
		const color = 0xffffff; // 색상
		const intensity = 1; // 광원의 세기
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4); // 광원위치
		this._scene.add(light); // 광원을 scene 객체의 구성요소로 추가하고있음
	}
	// 파란색 계열의 정육면체 Mesh를 생성하는 코드
	_setupModel() {
		const geometry = new THREE.BoxGeometry(1, 1, 1); // 가로, 세로, 깊이
		const material = new THREE.MeshPhongMaterial({ color: 0x44a88 });

		const cube = new THREE.Mesh(geometry, material);

		this._scene.add(cube);
		this._cube = cube;
	}

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height);
	}
	// time은 렌더링이 처음 시작된 이후 경과된 시간 값(단위 : 밀리초)
	// time인자를 통해서 장면의 애니메이션에 이용가능
	render(time) {
		// renderer가 scene을 카메라의 시점을 이용해서 렌더링하라 라는 코드
		this._renderer.render(this._scene, this._camera);
		// update메서드 안에서는 어떤 속성값을 변경하는데 속성값을 변경함으로써 애니메이션 효과를 발생시킨다
		this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}

	update(time) {
		time *= 0.001; // 밀리세컨단위를 세컨단위로 변경!
		this._cube.rotation.x = time;
		this._cube.rotation.y = time;
	}
}

window.onload = function () {
	new App();
};
