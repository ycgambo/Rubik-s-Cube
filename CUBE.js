var CUBE = {};

/**

 Extend capability

 Based on https://github.com/documentcloud/underscore/blob/bf657be243a075b5e72acc8a83e6f12a564d8f55/underscore.js#L767
 ECMAScript5 compatibility based on: http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible/

 */
CUBE.extend = function ( receiver, supplier ) {

    if ( Object.keys ) {

        // Modified: In a shorter way
        Object.keys(supplier).forEach(function(property) {
            Object.defineProperty(receiver, property, Object.getOwnPropertyDescriptor(supplier, property));
        });

        // Original:
        // var keys = Object.keys( supplier );
        //
        // for (var i = 0, il = keys.length; i < il; i++) {
        //     var prop = keys[i];
        //     Object.defineProperty( receiver, prop, Object.getOwnPropertyDescriptor( supplier, prop ) );
        // }

    } else {

        var safeHasOwnProperty = {}.hasOwnProperty;

        for ( var prop in supplier ) {
            if ( safeHasOwnProperty.call( supplier, prop ) ) {
                receiver[prop] = supplier[prop];
            }
        }

    }

    return receiver;
};

CUBE.extend( Array.prototype, {
    contains: function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    },
    distanceTo : function( target ){

        var i, sum = 0;

        if( arguments.length > 0 )
            target = Array.prototype.slice.call( arguments );
        if( this.length === target.length ){

            for( i = 0; i < this.length; i ++ )
                sum += Math.pow( target[i] - this[i], 2 );
            return Math.pow( sum, 0.5 );
        }
        else return null;
    },
    first : function(){

        return this[ 0 ];
    },
    last : function(){

        return this[ this.length - 1 ];
    },
    maximum : function(){

        return Math.max.apply( null, this );
    },
    middle : function(){

        return this[ Math.round(( this.length - 1 ) / 2 ) ];
    },
    minimum : function(){

        return Math.min.apply( null, this );
    },
    rand : function(){

        return this[ Math.floor( Math.random() * this.length )];
    },
    random : function(){//  Convenience here. Exactly the same as .rand().

        return this[ Math.floor( Math.random() * this.length )];
    },
    //  Ran into trouble here with Three.js. Will investigate....
    /*remove: function( from, to ){

        var rest = this.slice(( to || from ) + 1 || this.length )

        this.length = from < 0 ? this.length + from : from
        return this.push.apply( this, rest )
    },*/
    shuffle : function(){

        var
            copy = this,
            i = this.length,
            j,
            tempi,
            tempj;

        if( i == 0 ) return false;
        while( -- i ){

            j = Math.floor( Math.random() * ( i + 1 ));
            tempi = copy[ i ];
            tempj = copy[ j ];
            copy[ i ] = tempj;
            copy[ j ] = tempi;
        }
        return copy;
    },
    toArray : function(){

        return this;
    },
    toHtml : function(){

        var i, html = '<ul>';

        for( i = 0; i < this.length; i ++ ){

            if( this[ i ] instanceof Array )
                html += this[ i ].toHtml();
            else
                html += '<li>' + this[ i ] + '</li>';
        }
        html += '</ul>';
        return html;
    },
    toText : function( depth ){

        var i, indent, text;

        depth = _.cascade( depth, 0 );
        indent = '\n' + '\t'.multiply( depth );
        text = '';
        for( i = 0; i < this.length; i ++ ){

            if( this[ i ] instanceof Array )
                text += indent + this[ i ].toText( depth + 1 );
            else
                text += indent + this[ i ];
        }
        return text;
    }


});

CUBE.Color = function(name, initial, hex, styleF, styleB) {
    this.name = name;
    this.initial = initial;
    this.hex = hex;
    this.styleF = styleF;
    this.styleB = styleB;
};
CUBE.COLOR = new function() {
    this.RED = new CUBE.Color(
        'red',
        'R',
        '#F00',
        'font-weight: bold; color: #F00',
        'background-color: #F00; color: rgba( 255, 255, 255, 0.9 )'
    );
    this.YELLOW = new CUBE.Color(
        'yellow',
        'Y',
        '#FE0',
        'font-weight: bold; color: #ED0',
        'background-color: #FE0; color: rgba( 0, 0, 0, 0.5 )'
    );
    this.BLUE = new CUBE.Color(
        'blue',
        'B',
        '#00D',
        'font-weight: bold; color: #00D',
        'background-color: #00D; color: rgba( 255, 255, 255, 0.9 )'
    );
    this.ORANGE = new CUBE.Color(
        'orange',
        'O',
        '#F60',
        'font-weight: bold; color: #F60',
        'background-color: #F60; color: rgba( 255, 255, 255, 0.9 )'
    );
    this.WHITE = new CUBE.Color(
        'white',
        'W',
        '#FFF',
        'font-weight: bold; color: #888',
        'background-color: #F3F3F3; color: rgba( 0, 0, 0, 0.5 )'
    );
    this.GREEN = new CUBE.Color(
        'green',
        'G',
        '#0A0',
        'font-weight: bold; color: #0A0',
        'background-color: #0A0; color: rgba( 255, 255, 255, 0.9 )'
    );
    this.COLORLESS = new CUBE.Color(
        'colorless',
        'X',
        '#DDD',
        'color: #EEE',
        'color: #DDD'
    );
};
CUBE.extend(CUBE.COLOR, {
    colors: function() {
        return [this.RED, this.YELLOW, this.BLUE, this.ORANGE, this.WHITE, this.GREEN, this.COLORLESS];
    },
    getFromInit: function(init) {
        init = init.replace(/(^\s*)|(\s*$)/g,"");
        for (var colors = CUBE.COLOR.colors(), i = 0, l = colors.length; i < l; i++) {
            if (colors[i].initial === init) return colors[i];
        }
        return this.COLORLESS;
    },
    getFromInitList: function(initList) {
        var colors = [];
        initList.split(',').forEach(function (init) {
            colors.push(CUBE.COLOR.getFromInit(init));
        });
        return colors;
    }
});

CUBE.Cubelet = function(cube, id, faces) {
    this.cube = cube;
    this.id = id;
    this.faceArr = CUBE.COLOR.getFromInitList((faces === undefined) ? 'X,X,X,X,X,X' : faces);
};
CUBE.extend(CUBE.Cubelet.prototype, {
    faces: function (faceId, color) {
        if (faceId === undefined) return this.faceArr;

        if (faceId >= 0 && faceId < 6) {
            if (color !== undefined) this.faceArr[faceId] = color;

            return this.faceArr[faceId];
        }

        return CUBE.COLOR.COLORLESS;
    },
    right : function (color) {
        return this.faces(0, color);
    },
    up : function (color) {
        return this.faces(1, color);
    },
    front : function (color) {
        return this.faces(2, color);
    },
    left : function (color) {
        return this.faces(3, color);
    },
    down : function (color) {
        return this.faces(4, color);
    },
    back : function (color) {
        return this.faces(5, color);
    },
    rotate: function (axis, clockwise) {
        if (axis === undefined || clockwise === undefined) return false;
        clockwise = !!clockwise;
        /**
         * Let's say the origin faces is:
         *         [0, 1, 2, 3, 4, 5]
         *
         * Corresponding to axis, it will clockwise rotate to:
         *     0:  [0, 2, 4, 3, 4, 5]
         *     1:  [5, 1, 0, 2, 4, 3]
         *     2:  [1, 3, 2, 4, 0, 5]
         *
         * It's easy to find out when axis = 0:
         *     * faces 0 and 0 + 3 is at a standstill
         *     * other faces shift to left one or two times
         *
         * Same pattern can find in axis = 1 and axis = 2.
         * But axis = 1 has a opposite shift direction to axis = 0 and axis = 2.
         */

        // Since axis = 1 has a opposite rotate pattern,
        // what if we make the rotate direction opposite too?
        if (axis === 1) clockwise = !clockwise;

        var face_tmp = this.faceArr[axis + 1];
        if (clockwise === true) {
            this.faceArr[axis + 1] = this.faceArr[axis + 2];
            this.faceArr[axis + 2] = this.faceArr[(axis + 4) % 6];
            this.faceArr[(axis + 4) % 6] = this.faceArr[(axis + 5) % 6];
            this.faceArr[(axis + 5) % 6] = face_tmp;
        } else {
            this.faceArr[axis + 1] = this.faceArr[(axis + 5) % 6];
            this.faceArr[(axis + 5) % 6] = this.faceArr[(axis + 4) % 6];
            this.faceArr[(axis + 4) % 6] = this.faceArr[axis + 2];
            this.faceArr[axis + 2] = face_tmp;
        }
        return this.faceArr;
    }
});

CUBE.Cube = function() {
    this.rank = 3;

    /**
     * [[ 0,  1,  2], [ 3,  4,  5], [ 6,  7,  8]],
     * [[ 9, 10, 11], [12, 13, 14], [15, 16, 17]],
     * [[18, 19, 20], [21, 22, 23], [24, 25, 26]]
     */
    this.cubeletsMap = [];
    this.cubelets = [];
};
CUBE.extend(CUBE.Cube.prototype, {

    init: function(rank, cubeletsMap, cubelets) {

        this.rank = rank =
            (rank !== undefined || rank > 0) ? rank : 3;

        this.cubeletsMap = cubeletsMap =
            (cubeletsMap !== undefined) ? cubeletsMap : function (rank, rankDepth, startId) {

                var indexArr = [];
                for (var i = 0; i < rank; i++) {
                    if (rankDepth === 1) {
                        indexArr[i] = startId + i;
                    } else {
                        indexArr[i] = arguments.callee(rank, rankDepth - 1, startId + i * (function (dep) {
                            return (dep === 1) ? 1 :
                                (dep === 2) ? rank : rank * rank;
                        })(rankDepth));
                    }
                }

                return indexArr;
            }(this.rank, 3, 0);

        this.cubelets = cubelets =
            (cubelets !== undefined) ? cubelets : function (cube) {

                var cubeletList = [];

                for (var i = cube.rank * cube.rank * cube.rank; i-- > 0;) {
                    cubeletList[i] = new CUBE.Cubelet(cube, i);
                }

                cube.right().forEach(function(x) { x.forEach(function(y) { y.forEach(function(id) { cubeletList[id].right(CUBE.COLOR.RED); }) }) });
                cube.up()   .forEach(function(x) { x.forEach(function(y) { y.forEach(function(id) { cubeletList[id].up   (CUBE.COLOR.YELLOW); }) }) });
                cube.front().forEach(function(x) { x.forEach(function(y) { y.forEach(function(id) { cubeletList[id].front(CUBE.COLOR.BLUE); }) }) });
                cube.left() .forEach(function(x) { x.forEach(function(y) { y.forEach(function(id) { cubeletList[id].left (CUBE.COLOR.ORANGE); }) }) });
                cube.down() .forEach(function(x) { x.forEach(function(y) { y.forEach(function(id) { cubeletList[id].down (CUBE.COLOR.WHITE); }) }) });
                cube.back() .forEach(function(x) { x.forEach(function(y) { y.forEach(function(id) { cubeletList[id].back (CUBE.COLOR.GREEN); }) }) });

                return cubeletList;
            }(this);

        return this;
    },
    getCubelets: function(ids) {
        if (ids === undefined) ids = this.cubeletsMap;

        if (Array.isArray(ids)) {
            var rtn = [];
            for (var i = 0, l = ids.length; i < l; i++) {
                rtn[i] = this.getCubelets(ids[i]);
            }
            return rtn;
        } else {
            return this.cubelets[ids];
        }
    },
    right: function(cubeletsMap) {
        if (cubeletsMap === undefined) cubeletsMap = this.cubeletsMap;

        var x = cubeletsMap.length - 1, y_max = cubeletsMap[0].length, z_max = cubeletsMap[0][0].length;

        var rtn = [];
        rtn[0] = [];
        for (var y = 0; y < y_max; y++) {
            rtn[0][y] = [];
            for (var z = 0; z < z_max; z++) {
                rtn[0][y][z] = cubeletsMap[x][y][z];
            }
        }
        return rtn;
    },
    up: function(cubeletsMap) {
        if (cubeletsMap === undefined) cubeletsMap = this.cubeletsMap;

        var x_max = cubeletsMap.length, y = cubeletsMap[0].length - 1, z_max = cubeletsMap[0][0].length;

        var rtn =[];
        for (var x = 0; x < x_max; x++) {
            rtn[x] = [];
            rtn[x][0] = [];
            for (var z = 0; z < z_max; z++) {
                rtn[x][0][z] = cubeletsMap[x][y][z];
            }
        }
        return rtn;
    },
    front: function(cubeletsMap) {
        if (cubeletsMap === undefined) cubeletsMap = this.cubeletsMap;

        var x_max = cubeletsMap.length, y_max = cubeletsMap[0].length, z = cubeletsMap[0][0].length - 1;

        var rtn =[];
        for (var x = 0; x < x_max; x++) {
            rtn[x] = [];
            for (var y = 0; y < y_max; y++) {
                rtn[x][y] = [];
                rtn[x][y][0] = cubeletsMap[x][y][z];
            }
        }
        return rtn;
    },
    left: function(cubeletsMap) {
        if (cubeletsMap === undefined) cubeletsMap = this.cubeletsMap;

        var x = 0, y_max = cubeletsMap[0].length, z_max = cubeletsMap[0][0].length;

        var rtn = [];
        rtn[x] = [];
        for (var y = 0; y < y_max; y++) {
            rtn[x][y] = [];
            for (var z = 0; z < z_max; z++) {
                rtn[x][y][z] = cubeletsMap[x][y][z];
            }
        }
        return rtn;
    },
    down: function(cubeletsMap) {
        if (cubeletsMap === undefined) cubeletsMap = this.cubeletsMap;

        var x_max = cubeletsMap.length, y = 0, z_max = cubeletsMap[0][0].length;

        var rtn =[];
        for (var x = 0; x < x_max; x++) {
            rtn[x] = [];
            rtn[x][y] = [];
            for (var z = 0; z < z_max; z++) {
                rtn[x][y][z] = cubeletsMap[x][y][z];
            }
        }
        return rtn;
    },
    back: function(cubeletsMap) {
        if (cubeletsMap === undefined) cubeletsMap = this.cubeletsMap;

        var x_max = cubeletsMap.length, y_max = cubeletsMap[0].length, z = 0;

        var rtn =[];
        for (var x = 0; x < x_max; x++) {
            rtn[x] = [];
            for (var y = 0; y < y_max; y++) {
                rtn[x][y] = [];
                rtn[x][y][z] = cubeletsMap[x][y][z];
            }
        }
        return rtn;
    },
    middle: function(cubeletsMap) {
        if (cubeletsMap === undefined) cubeletsMap = this.cubeletsMap;

        var x_max = cubeletsMap.length, y_max = cubeletsMap[0].length, z_max = cubeletsMap[0][0].length;

        if (x_max < 3) return [];

        var rtn = [];
        for (var x = 1; x < x_max - 1; x++) {
            rtn[x - 1] = [];
            for (var y = 0; y < y_max; y++) {
                rtn[x - 1][y] = [];
                for (var z = 0; z < z_max; z++) {
                    rtn[x - 1][y][z] = cubeletsMap[x][y][z];
                }
            }
        }
        return rtn;
    },
    equator: function(cubeletsMap) {
        if (cubeletsMap === undefined) cubeletsMap = this.cubeletsMap;

        var x_max = cubeletsMap.length, y_max = cubeletsMap[0].length, z_max = cubeletsMap[0][0].length;

        if (y_max < 3) return [];

        var rtn = [];
        for (var x = 0; x < x_max; x++) {
            rtn[x] = [];
            for (var y = 1; y < y_max - 1; y++) {
                rtn[x][y - 1] = [];
                for (var z = 0; z < z_max; z++) {
                    rtn[x][y - 1][z] = cubeletsMap[x][y][z];
                }
            }
        }
        return rtn;
    },
    standing: function(cubeletsMap) {
        if (cubeletsMap === undefined) cubeletsMap = this.cubeletsMap;

        var x_max = cubeletsMap.length, y_max = cubeletsMap[0].length, z_max = cubeletsMap[0][0].length;

        if (z_max < 3) return [];

        var rtn = [];
        for (var x = 0; x < x_max; x++) {
            rtn[x] = [];
            for (var y = 0; y < y_max; y++) {
                rtn[x][y] = [];
                for (var z = 1; z < z_max - 1; z++) {
                    rtn[x][y][z - 1] = cubeletsMap[x][y][z];
                }
            }
        }
        return rtn;
    },
    /**
     * Twist a layer around a given axis 90 degrees in clockwise or anticlockwise.
     * In the meanwhile, corresponding cubelets are rotated too.
     *
     * @param axis          int     the axis to rotate around. 0 for X, 1 for Y, 2 for Z
     * @param layers        array   layers want to roate. start from 0 and end before the cube's rank
     * @param clockwise     bool    colockwise or anticlockwise
     *
     * Each param must be clearfied
     */
    twist: function (axis, layers, clockwise) {
        if (axis === undefined || layers === undefined || !(layers instanceof Array) || clockwise === undefined) return false;
        clockwise = !!clockwise;

        var x_max = this.cubeletsMap.length, y_max = this.cubeletsMap[0].length, z_max = this.cubeletsMap[0][0].length;

        var rotated = [], x, y, z;

        for (x = 0; x < x_max; x++)
            for (rotated[x] = [], y = 0; y < y_max; y++)
                for (rotated[x][y] = [], z = 0; z < z_max; z++)
                    rotated[x][y][z] = this.cubeletsMap[x][y][z];

        var i, j, k;    // temp index for x, y, z to caculate how to rotate
        for (x = 0; x < x_max; x++) {
            if (axis === 0 && !layers.contains(x)) continue;

            for (y = 0; y < y_max; y++) {
                if (axis === 1 && !layers.contains(y)) continue;

                for (z = 0; z < z_max; z++) {
                    if (axis === 2 && !layers.contains(z)) continue;

                    if (axis === 0) {
                        i = x;
                        j = z;
                        k = z_max - y - 1;
                    } else if (axis === 1) {
                        i = x_max - z - 1;
                        j = y;
                        k = x;
                    } else if (axis === 2) {
                        i = y;
                        j = y_max - x - 1;
                        k = z;
                    }

                    if (clockwise === true) {
                        rotated[i][j][k] = this.cubeletsMap[x][y][z];
                        this.cubelets[rotated[i][j][k]].rotate(axis, clockwise);
                    } else {
                        rotated[x][y][z] = this.cubeletsMap[i][j][k];
                        this.cubelets[rotated[x][y][z]].rotate(axis, clockwise);
                    }
                }
            }
        }

        return this.cubeletsMap = rotated;
    },
    /**
     * Shuffle a cube by randomly twists it.
     * Each shuffle may twist this cube around X, Y and Z three times.
     *
     * @param times     int     how many times to shuffle this cube.
     */
    shuffle: function (times) {
        if (times === undefined || times < 0) times = Math.floor(Math.random()*6 + 10); // 5 to 15 times

        for (var i = 0; i < times; i++){
            this.twist(0, [Math.floor(Math.random()*3)], Math.floor(Math.random()*2));
            this.twist(1, [Math.floor(Math.random()*3)], Math.floor(Math.random()*2));
            this.twist(2, [Math.floor(Math.random()*3)], Math.floor(Math.random()*2));
        }
    }
});

CUBE.Render = function() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.camera.position.x = 5;
    this.camera.position.y = 5;
    this.camera.position.z = 8;
    this.camera.lookAt({x: 0, y: 0, z: 0});
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild( this.renderer.domElement );
};
CUBE.extend(CUBE.Render.prototype, {
    animate: function () {
        requestAnimationFrame( this.animate );

        // mesh.rotation.x += 0.1;
        // mesh.rotation.y += 0.1;

        this.renderer.render(this.scene, this.camera);
    },
    createCube: function (cube) {
        if (cube === undefined || !cube instanceof CUBE.Cube) return false;

        var x_max = cube.cubeletsMap.length, y_max = cube.cubeletsMap[0].length, z_max = cube.cubeletsMap[0][0].length;

        for (var x = 0; x < x_max; x++) {
            for (var y = 0; y < y_max; y++) {
                for (var z = 0; z < z_max; z++) {
                    var matArray = [];
                    matArray.push(new THREE.MeshBasicMaterial({color: cube.cubelets[cube.cubeletsMap[x][y][z]].right().hex}));
                    matArray.push(new THREE.MeshBasicMaterial({color: cube.cubelets[cube.cubeletsMap[x][y][z]].right().hex}));
                    matArray.push(new THREE.MeshBasicMaterial({color: cube.cubelets[cube.cubeletsMap[x][y][z]].up().hex}));
                    matArray.push(new THREE.MeshBasicMaterial({color: cube.cubelets[cube.cubeletsMap[x][y][z]].up().hex}));
                    matArray.push(new THREE.MeshBasicMaterial({color: cube.cubelets[cube.cubeletsMap[x][y][z]].front().hex}));
                    matArray.push(new THREE.MeshBasicMaterial({color: cube.cubelets[cube.cubeletsMap[x][y][z]].front().hex}));
                    matArray.push(new THREE.MeshBasicMaterial({color: cube.cubelets[cube.cubeletsMap[x][y][z]].left().hex}));
                    matArray.push(new THREE.MeshBasicMaterial({color: cube.cubelets[cube.cubeletsMap[x][y][z]].left().hex}));
                    matArray.push(new THREE.MeshBasicMaterial({color: cube.cubelets[cube.cubeletsMap[x][y][z]].down().hex}));
                    matArray.push(new THREE.MeshBasicMaterial({color: cube.cubelets[cube.cubeletsMap[x][y][z]].down().hex}));
                    matArray.push(new THREE.MeshBasicMaterial({color: cube.cubelets[cube.cubeletsMap[x][y][z]].back().hex}));
                    matArray.push(new THREE.MeshBasicMaterial({color: cube.cubelets[cube.cubeletsMap[x][y][z]].back().hex}));
                    var faceMaterial = new THREE.MeshFaceMaterial(matArray);
                    var cubeletGeom = new THREE.BoxGeometry( 2, 2, 2 );
                    var cubelet = new THREE.Mesh(cubeletGeom, faceMaterial);

                    // size * ( x - ( rank/2 - 1/2) )
                    // cubelet.position means the center of it in THREE.js
                    cubelet.position.set(x * 2 - cube.rank + 1, y * 2 - cube.rank + 1, z * 2 - cube.rank + 1);

                    this.scene.add(cubelet);
                }
            }
        }
    },
    render: function (cube) {
        this.cube = cube;
        this.createCube(cube);
        this.animate();
    }
});

var c = new CUBE.Cube();
c.init();
c.shuffle();
var r = new CUBE.Render();
r.render(c);

