"use strict";

var canvas;
var gl;

let x0 = 0
let y0 = 1
let x1 = -1
let y1 = -1
let x2 = 1
let y2 = -1


var points = [];

var numTimesToSubdivide = 0;

function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2(x0, y0),
        vec2(x1, y1),
        vec2(x2, y2)
    ];
    divideTriangle(vertices[0], vertices[1], vertices[2],
        numTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 50000, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    document.getElementById("slider").onchange = function (event) {
        numTimesToSubdivide = parseInt(event.target.value);
    };

    canvas.addEventListener("mouseup", function (event) {
        //console.log(event.clientX, event.clientY);

        let rect = gl.canvas.getBoundingClientRect();
        let newx = (event.clientX - rect.left) / canvas.width * 2 - 1;
        let newy = (event.clientY - rect.top) / canvas.height * -2 + 1;

        console.log(newx, newy);

        let vertex_id = document.querySelector('input[name="vertex"]:checked').value;
        if (vertex_id == 0) {
            x0 = newx;
            y0 = newy;
        } else if (vertex_id == 1) {
            x1 = newx;
            y1 = newy;
        } else {
            x2 = newx;
            y2 = newy;
        }


    });



    render();
};

function triangle(a, b, c) {
    points.push(a, b, c);
}

function divideTriangle(a, b, c, count) {

    // check for end of recursion

    if (count === 0) {
        triangle(a, b, c);
    }
    else {

        //bisect the sides

        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);

        --count;
        
        // three new triangles
        divideTriangle(a, ab, ac, count);
        divideTriangle(c, ac, bc, count);
        divideTriangle(b, bc, ab, count);
    }
}

window.onload = init;

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
    points = [];
    requestAnimFrame(init);
}
