$(document).ready(function(){	
	buildGraph();
	shuffle();
});

function buildGraph(){
	$("#provShuffle").addClass("disabled");	
	var g = {
        nodes: [],
        edges: []
    };

	var s = new sigma({
	    graph: g,
	    container: 'graph2',
	    renderer: {
	        container: document.getElementById('graph2'),
	        type: 'canvas'
	    },
	    settings:{
	        sideMargin:0.5,
	        zoomMax:1.25,
	        minNodeSize: 8,
	        maxNodeSize: 20,
	        
	        /*
	        borderSize:0,
	        nodeHoverColor:"default",
	        defaultNodeBorderColor:"#8AAAC5",
	        */
	       
	        defaultLabelHoverColor:"#eee",
	        defaultHoverLabelBGColor:"#333",
	        
	        //labelSize:"proportional",
	        //labelSizeRatio:1.5,    
	        minEdgeSize:2,
	        maxEdgeSize:2
	        
			//edgeColor:"default",
			//defaultEdgeColor:"#ccc",
			
			//Does not actually work
			/*	
			enableEdgeHovering:true,
			edgeHoverColor:"default",
			defaultEdgeHoverColor:"#d91616",
	        edgeHoverPrecision: 10,
	        edgeHoverSizeRatio:2
	        */
	    }
	});
	
	sigma.parsers.json(
        'prov3.json', s,
        function(){
            var i, nodes = s.graph.nodes(), len = nodes.length;
            for (i = 0; i < len; i++) {
                nodes[i].x = Math.random();
                nodes[i].y = Math.random();
                nodes[i].size = s.graph.degree(nodes[i].id);
                nodes[i].color = "#2a6496";//
            }		
            s.refresh();
            
            faConfig = {
        		barnesHutTheta: .75,
        		linLogMode: false,
        		adjustSizes: true,
        		edgeWeightInfluence: 10,
        		scalingRatio:1,
        		strongGravityMode: false,
        		gravity: 0,
        		slowDown: 100	            		 
            };
             
            faConfig2 = {
            		linLogMode: false,
            		adjustSizes: true,
            		edgeWeightInfluence: 10,
            		scalingRatio:1,
            		strongGravityMode: false,
            		gravity: 0,
            		slowDown: 100000	                		 
            };

            s.configForceAtlas2(faConfig)
            s.startForceAtlas2();
            setTimeout(function() { 
            	s.stopForceAtlas2(); 
            	s.killForceAtlas2();
            	$("#provShuffle").removeClass("disabled");	
            	//console.log(e.type, e.data.node.label, e.data.captor);	
            	
            	s.bind('clickNode',function(e){
            		var uri = e.data.node.uri;
            		if(uri != null){
            			var win = window.open(uri, '_blank');
            			win.focus();
            		}
            	})
            	
            	s.bind('overNode outNode' , function(e){
            		var nodes = e.data.renderer.nodesOnScreen;
                 	var edges = e.data.renderer.edgesOnScreen;
                 	var id = e.data.node.id;
                 	
                 	var outColor = "#ccc";
                 	var inColor = "#ccc";
                 	var nsColor = "#ccc"
                 	var nodeColor = "#2a6496";
                 	var selectedNodes = [];
                 	selectedNodes.push(id);
                 	
                 	if(e.type === "overNode"){
                 		 outColor = "#d91616";
                     	 inColor = "#00d093";
                     	 nsColor = "transparent"
                     	 nodeColor = "#ddd";
	                	 if(e.data.node.uri != null){
	                		 document.body.style.cursor = "pointer";	 
	                	 }
                 	}else{
                 		document.body.style.cursor = "default";
                 	}
                 
                 	//Recolor all edges
                 	for (i = 0; i < edges.length; i++){
                 		var edge = edges[i];
                 		if(edge.source === id){
                 			selectedNodes.push(edge.target);
                 			edge.color=outColor;  	
                 		}else if(edge.target === id){
                 			selectedNodes.push(edge.source);
                 			edge.color=inColor;  
             			}else{            
                 			edge.color=nsColor;   
                 		}
                 	}
                 	
                 	//Recolor non-selected nodes
                 	for(i = 0; i < nodes.length; i++){
                 		var node = nodes[i];
                 		if(selectedNodes.indexOf(node.id) == -1){
                 			node.color=nodeColor;
                 		}
                 	}
                 	
                 	//Redraw the graph
                 	s.configForceAtlas2(faConfig2);
         			s.startForceAtlas2();
         			setTimeout(function() { 
     	            	s.stopForceAtlas2(); 
     	            	s.killForceAtlas2();
     	            }, 100);
                 	
                 });
            }, 1500);

            //Drag and drop support
            /*
        
        	var hoverListener = sigma.misc.drawHovers(s, s.renderers[0]);
            hoverListener.bind('overNode outNode', function(event) {
      		  console.log(event);
      		});
               
            var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
    		dragListener.bind('startdrag', function(event) {
    		  console.log(event);
    		});
    		dragListener.bind('drag', function(event) {
    		  console.log(event);
    		});
    		dragListener.bind('drop', function(event) {
    		  console.log(event);
    		});
    		dragListener.bind('dragend', function(event) {
    		  console.log(event);
    		});
    		*/
        }
	);
}

function shuffle(){
	$("#provShuffle").click(function(){
		$("#graph2").html("");
		buildGraph();	
	});
}
