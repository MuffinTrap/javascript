/** WebGL javascript demo based on
 WebGL Programming Guide 
 */
 
 /** Shady shader source codes 
  * 
  * gl_PointSize is in Pixels :Oc
  * */
 
 var VSHADER_SOURCE = 
 "attribute vec4 attribPosition; \n" +
 "attribute float attribPointSize; \n" +
 "void main() 		\n" + 
 "{					\n" +
 "	gl_Position = attribPosition; \n" +
 "	gl_PointSize = attribPointSize; \n" +
 "}					\n";
 
 var FSHADER_SOURCE = 
 "void main()		\n" +
 "{ 				\n" +
 "	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); \n" +
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
	 
	 // Get address of attribPosition
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
	 
	 // pass position
	 gl.vertexAttrib3f(attribPosition, 0.5, 0.0, 0.0);
	 gl.vertexAttrib1f(attribPointSize, 3.0);
	 
	 gl.clearColor(0.3, 0.5, 0.0, 1.0);
	 gl.clear(gl.COLOR_BUFFER_BIT);
	 
	 gl.drawArrays(gl.POINTS, 0, 1);
 }
