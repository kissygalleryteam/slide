/*
combined files : 

gallery/slide/1.1/a
gallery/slide/1.1/index

*/

KISSY.add('gallery/slide/1.1/a',function(){

		
		});

/**
 * @fileoverview 请修改组件描述
 * @author bachi<bachi@taobao.com>
 * @module slide
 **/
KISSY.add('gallery/slide/1.1/index',function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * 请修改组件描述
     * @class Slide
     * @constructor
     * @extends Base
     */
    function Slide(comConfig) {
		alert(1230);
        var self = this;
        //调用父类构造函数
        Slide.superclass.constructor.call(self, comConfig);
    }
    S.extend(Slide, Base, /** @lends Slide.prototype*/{

    }, {ATTRS : /** @lends Slide*/{

    }});
    return Slide;
}, {requires:['node', 'base','./a']});




