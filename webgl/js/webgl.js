/** WebGL javascript demo based on
 WebGL Programming Guide 
 */
 
 /** Shady shader source codes 
  * 
  * gl_PointSize is in Pixels :Oc
  * */
 
 var VSHADER_SOURCE = 
 "attribute vec4 attribPosition; 	\n" +
 "attribute float attribPointSize; 	\n" +
 "attribute vec3 attribColor;		\n" +
 "uniform vec4 unifTranslation;		\n" +
 "varying vec4 varyColor;			\n" +
 "void main() 		\n" + 
 "{					\n" +
 "	gl_Position = attribPosition + unifTranslation; 	\n" +
 "	gl_PointSize = attribPointSize; \n" +
 "	varyColor = vec4(attribColor, 1.0); \n" +
 "}									\n";
 
 var FSHADER_SOURCE = 
 "precision mediump float;		\n" +
 "varying vec4 varyColor;		\n" +
 "void main()		\n" +
 "{ 				\n" +
 "	gl_FragColor = varyColor; \n" +
 "}					\n";
 
 
 window.onload = function()
 {
	 var canvas = document.getElementById("canvas");
	 var gl = getWebGLContext(canvas);
	 if(!gl)
	 {
		 console.log("Failed to get WebGL context");
		 return;
	 }
	 
	 // Connect power to the shader systems!
	 if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
	 {
		 console.log("Failed to init shaders, captain");
		 return;
	 }
	 
	 // Get addresses of attribs
	 var attribPosition = gl.getAttribLocation(gl.program, "attribPosition");
	 if( attribPosition < 0) 
	 {
		 console.log("Failed to get the position of attribPosition from WebGL");
		 return;
	 }
	 var attribPointSize = gl.getAttribLocation(gl.program, "attribPointSize");
	 if( attribPointSize < 0)
	 {
		 console.log("Failed to get the position of attribPointSize from WebGL");
		 return;
	 }
	 var attribColor = gl.getAttribLocation(gl.program, "attribColor");
	 if( attribColor < 0)
	 {
		 console.log("Failed to get the position of attribColor from WebGL");
	 }
	 
	 // pass position
	 gl.vertexAttrib3f(attribPosition, 0.5, 0.0, 0.0);
	 gl.vertexAttrib1f(attribPointSize, 3.0);
	 
	 var translation = new Vec3(0.0, 0.0, 0.0);
	 
	 var points = new Float32Array([0.0, 0.0, 0.0,		// pos 
								2.0, 				// size
								1.0, 1.0, 1.0		// color
							]);
							
	 var floatSize = points.BYTES_PER_ELEMENT;
	 var vertexSize =  5 * floatSize;
	 var positionOffset = 0 * floatSize;
	 var sizeOffset =  3 * floatSize;
	 var colorOffset = 4 * floatSize;
	 
	 var vertexBuffer = gl.createBuffer();
	 if( vertexBuffer < 0)
	 {
		 console.log("Could not create buffer");
	 }
	 gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	 gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
	 
	 gl.vertexAttribPointer(attribPosition, 3, gl.FLOAT, false, vertexSize, positionOffset);
	 gl.enableVertexAttribArray(attribPosition);
	 
	 gl.vertexAttribPointer(attribPointSize, 1, gl.FLOAT, false, vertexSize, sizeOffset);
	 gl.enableVertexAttribArray(attribPointSize);
	 
	 gl.vertexAttribPointer(attribColor, 3, gl.FLOAT, false, vertexSize, colorOffset);
	 gl.enableVertexAttribArray(attribColor);
	 
	 gl.clearColor(0.3, 0.5, 0.0, 1.0);
	 gl.clear(gl.COLOR_BUFFER_BIT);
	 
	 gl.drawArrays(gl.POINTS, 0, 1);
 }
