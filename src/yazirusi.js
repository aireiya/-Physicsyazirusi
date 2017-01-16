
var line = [];

var fillcol = new cc.Color(255,255,255,128);
var linecol = new cc.Color(10,200,10,128);

var startTouch;
var endTouch;

var sankaku = [];
var node;

var layer0;

var space;
var shape
//var sprite;

var touchpl = false;

var totem;

var gameScene = cc.Scene.extend({
  onEnter: function() {
    this._super();
    winSize = cc.director.getWinSize();

    layer0 = new gameLayer();
    layer0.init();
    this.addChild(layer0);

  }
});

var gameLayer = cc.Layer.extend({
   player: null,
   sprite:null, // 物理演算をする空間

  init: function() {
    this._super();

    var size = cc.director.getWinSize();

    space = new cp.Space(); // Space（物理演算する空間）を作成
    space.gravity = cp.v(0, -98); // 重力を設定

        this._debugNode = new cc.PhysicsDebugNode(space); // 物体の形状を表示するデバッグノードを作成
        this._debugNode.setVisible(true); // 表示する
        this.addChild(this._debugNode, 10); // 自ノード（レイヤー）の最前面に追加

        var shapeBottom = new cp.SegmentShape( // 底面として、線の形状を作成
        		new cp.StaticBody(), // 静体（動かない物体）
        		cp.v(0, 50), // 始点
        		cp.v(size.width, 50), // 終点
        		0); // 線の太さ
        shapeBottom.setElasticity(0.8); // 弾性係数を設定
        shapeBottom.setFriction(0.8); // 摩擦係数を設定
        space.addStaticShape(shapeBottom); // 空間に物体を追加

//プレイヤー生成
    player = cc.Sprite.create(res.player01);
    //player.setPosition(size.width / 2, size.height / 2);
    this.addChild(player, 1);


    //node.drawPoly(sankaku,  fillcol,5, linecol);
    //node.drawPoly(sankaku);

    node = new cc.DrawNode();

    this.addChild(node, 2);

    //this.initSpace();
    /*var winWidth = cc.winSize.width;
    var winHeight = cc.winSize.height;
    totem =  this.createDynamicObject(res.totem_png, winWidth / 2 - 10, winHeight, 1, 0.2, 2.0, ""/*質量、摩擦*/
  //);

this.scheduleUpdate();

        // タップイベントリスナーを登録する
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: this.onTouchBegan,
                    onTouchMoved: this.onTouchMoved,
                    onTouchEnded: this.onTouchEnded
                }, this);

        return true;

  },

  onTouchBegan: function(touch, event) {
    //console.log("たっち" + touch.getLocation().x +" " + touch.getLocation().y);
    startTouch = touch.getLocation();
    node.setPosition(startTouch);
    //player.setPosition(startTouch);

    // 物理スプライト
    var physicsSprite = new cc.PhysicsSprite(res.player01);

					var contentSize = player.getContentSize(); // 画像のサイズを取得
					var body = new cp.Body(1, cp.momentForBox(1, contentSize.width, contentSize.height)); // Bodyを作成
					body.setPos(touch.getLocation()); // Bodyをタッチ位置に配置
          space.addBody(body); // Spaceに追加
					shape = new cp.BoxShape(body, contentSize.width, contentSize.height); // Shapeを作成
					shape.setElasticity(0.2); // 弾性係数を設定
					shape.setFriction(0.2); // 摩擦係数を設定
					space.addShape(shape); // Shapeを追加
					player.body = body; // 画像（PhysicsSprite）にBodyを設定

          physicsSprite.setBody(body);
          physicsSprite.setPosition(touch.getLocation());
          this.addChild(physicsSprite);

    return true;

  }.bind(this),// レイヤーのthisを使えるようにする

  onTouchMoved: function(touch, event) {
    //cc.log("Touch Moved!");
    endTouch = touch.getLocation();
    var abstouchX = Math.abs(endTouch.x);
    //console.log(abstouchX);
    var abstouchY = Math.abs(endTouch.y);
    //console.log(abstouchY);
    touchpl = true;
  },
  onTouchEnded: function(touch, event) {
    endTouch = touch.getLocation();
    touchpl = false;
    //player.body.applyImpulse(cp.v(10, 0), cp.v(0, 0)); //run speed
  },

  update: function(dt) {

    // 物理エンジンの更新
      space.step(dt);

    //shape.image.x = shape.body.p.x;
    //shape.image.y = shape.body.p.y;
/*
    var dX = player.getDistanceX();
    player.setPosition(cc.p(-dX, 0));*/
/*
      for (var i = 0; i < shapeArray.length; i++) {
         var shape = shapeArray[i];
         shape.image.x = shape.body.p.x;
         shape.image.y = shape.body.p.y;
         var angle = Math.atan2(-shape.body.rot.y, shape.body.rot.x);
         shape.image.rotation = angle * 180 / 3.14;
      }*/

    if(touchpl){
       node.setVisible(true);
      this.calcDirection(); //角度計算と矢印の長さを設定
    }else {
         node.setVisible(false);
         node.clear();
      }
    //スタート押したら動くように、ontouchでフラグ立て
    //法則入れる　消えるときはmap[i][j]を-1、生まれるときは+1、0から生まれるときは+3
  },
  //◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
  //前提条件　arrow という　node 　で　矢印ノードがすでに定義されているものとする。
// 矢印は原点(0,0)　が　矢印の向きの頂点でという設定ね

//スワイプ方向を検出する処理
calcDirection: function(){
    var distX = endTouch.x - startTouch.x ;
    var distY = endTouch.y - startTouch.y ;
    var distT = Math.sqrt(distX  * distX  + distY * distY);

if(distT > 60){
    //console.log(distX);
    //console.log(distY);
    //console.log(distT);

    node.clear();

    var sankaku = [
      cc.p(0,0),  //上頂点
      cc.p(35,-35),  //右
      cc.p(15,-35),   //内側
      cc.p(0, -(distT - 10)),   //下
      cc.p(-15,-35), //上に
      cc.p(-35,-35),   //左に
    ]

    var lineWidth = 3;
    node.drawPoly(sankaku,  fillcol,lineWidth, linecol);

//角度（ラジアン）を求める
var angle= Math.atan2(distY , distX );

//角度（ラジアン）を角度（度数）に変換
angle = angle * 180 / Math.PI ;
//console.log("アングル" + angle);
//矢印を回転させる
node.setRotation(270 - angle);
}
},

});

var GamestartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();

        // 背景レイヤーをその場で作る
        var backgroundLayer = new cc.LayerColor(new cc.Color(20, 50, 20, 128));
        this.addChild(backgroundLayer);

        var layer1 = new gameScene();
        this.addChild(layer1);
    }
});
