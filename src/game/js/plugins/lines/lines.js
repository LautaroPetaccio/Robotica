(function () {
	me.Line = me.Line.extend({
		intersection : function(aLine) {
	      var aLineX1 = aLine.points[0].x + aLine.pos.x;
	      var aLineY1 = aLine.points[0].y + aLine.pos.y;
	      var aLineX2 = aLine.points[1].x + aLine.pos.x;
	      var aLineY2 = aLine.points[1].y + aLine.pos.y;

	      var thisLineX1 = this.points[0].x + this.pos.x;
	      var thisLineY1 = this.points[0].y + this.pos.y;
	      var thisLineX2 = this.points[1].x + this.pos.x;
	      var thisLineY2 = this.points[1].y + this.pos.y;

	      // denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
	      var denominator = ((aLineY2 - aLineY1) * (thisLineX2 - thisLineX1)) - 
	        ((aLineX2 - aLineX1) * (thisLineY2 - thisLineY1));
	      if (denominator == 0)
	          return null;
	      new me.Vector2d()
	      var a = thisLineY1 - aLineY1;
	      var b = thisLineX1 - aLineX1;
	      var numerator1 = ((aLineX2 - aLineX1) * a) - ((aLineY2 - aLineY1) * b);
	      var numerator2 = ((thisLineX2 - thisLineX1) * a) - ((thisLineY2 - thisLineY1) * b);
	      a = numerator1 / denominator;
	      b = numerator2 / denominator;

	      // if line2 is a segment and line1 is infinite, they intersect if:
	      if ((b > 0 && b < 1) && (a > 0 && a < 1)) {
	        var x = thisLineX1 + (a * (thisLineX2 - thisLineX1));
	        var y = thisLineY1 + (a * (thisLineY2 - thisLineY1));
	        return me.pool.pull("vector", x, y);
	      }
	      // if line1 and line2 are segments, they intersect if both of the above are true
	      return null;
	    }
	});

	me.Body = me.Body.extend({
		getEdgesAsLines : function() {
			var result = [];
			if(this.points.length == 2)
				return [me.pool.pull("line", 0, 0, [this.points[0], this.points[1]])];
			for(var i = 0; i < this.points.length; i++) {
				if(i < this.points.length - 1)
					result.push(me.pool.pull("line", 0, 0, [this.points[i], this.points[i + 1]]));
				else
					result.push(me.pool.pull("line", 0, 0, [this.points[i], this.points[0]]));
			}
			return result;
		}
	});

	me.Entity = me.Entity.extend({
		getBodyEdgesAsLines : function() {
			var result = this.body.getEdgesAsLines();
			/* Get the edges of the shape transformed to world positions */
			for(var i = 0; i < result.length; i++) {
				result[i].pos.x += this.pos.x;
				result[i].pos.y += this.pos.y;
			}
			return result;
		}
	});

})();