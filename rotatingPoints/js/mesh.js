/* Mesh class for storing 3D models 
 * 
 * Depends on Vec3.js
 * 
 * */

function Vertex( position, size, color)
{
	this.vertexBuffer = -1;
	
	this.position = new Vec3(0.0, 0.0, 0.0);
	if(position != null && typeof position !== 'undefined')
	{
		this.position.copy(position);
	}
	
	this.size = 1.0;
	if( size != null || typeof position !== "undefined")
	{
		this.pointSize = size;
	}
	
	this.color = new Color(1.0, 1.0, 1.0, 1.0);
	if( color != null || typeof color !== "undefined")
	{
		this.color.copy(color);
	}
	
}

Vertex.prototype.setValues = function(position, size, color)
{
	this.position.copy(position);
	this.pointSize = size;
	this.color.copy(color);
}

Vertex.prototype.print = function()
{
	console.log("__ Vertex __");
	this.position.print();
	console.log(this.pointSize);
	this.color.print();
	
}

function Mesh()
{
	this.translation = new Vec3(0.4, 0.0, 0.0);
	this.vertices = [];
	this.vertexArray = null; // Float32Array
	this.amountVertices = 0;
	
	// simple rotation
	this.angle = 0.0;
}


// Call when all vertices have been added
Mesh.prototype.fillBuffer = function(glContext)
{
	if(this.vertices.length == 0)
	{
		console.logError("No vertices to buffer in mesh");
	}
	this.amountVertices = this.vertices.length;
	
	var floatArray = [];
	for( var i = 0; i < this.amountVertices; i++)
	{
		floatArray.push( this.vertices[i].position.x);
		floatArray.push( this.vertices[i].position.y);
		floatArray.push( this.vertices[i].position.z);
		
		floatArray.push( this.vertices[i].pointSize);
		
		floatArray.push( this.vertices[i].color.r);
		floatArray.push( this.vertices[i].color.g);
		floatArray.push( this.vertices[i].color.b);
		
		
		// this.vertices[i].print();
	}
	
	/*
	console.log("Floatarray");
	for( var v = 0; v < this.amountVertices; v++)
	{
		a = v * 7;
		console.log("vertex____");
		console.log(floatArray[a] + " " + floatArray[a+1] + " " +floatArray[a+2]);
		console.log(floatArray[a+3]); 
		console.log(floatArray[a+4] + " " + floatArray[a+5] + " " +floatArray[a+6]);
	}
	*/
	
	this.vertexArray = new Float32Array( floatArray );
	
	this.vertexBuffer = glContext.createBuffer();
	if( this.vertexBuffer <= 0)
	{
		console.logError("Mesh could not create buffer for itself");
		return;
	}
	console.log("Mesh got buffer:" + this.vertexBuffer);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.vertexArray, gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	console.log("Buffer created for mesh " + this.amountVertices + " vertices");
	
}
