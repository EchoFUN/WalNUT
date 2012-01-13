/**
 * JavaScript Common Templates(jCT) 3(第3版)
 * http://code.google.com/p/jsct/
 *
 * licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Author achun (achun.shx at gmail.com)
 * Create Date: 2008-6-23
 * Last Date: 2009-12-23
 * Revision:3.9.12.23
 */
function jCT(txt,path){//构建jCT对象,仅仅准备基础数据
	if(jCT.clearWhiteSpace)
		txt=txt.replace(/[\f\n\r\t\v]+/g,'');
	this.Fn = new jCT.Instance(txt,path);
	for (var i in this) this.Fn.Reserve+=i+',';
}
jCT.prototype={
	Extend:function(jct,args){//扩展自己
		for (var i in jct){
			if(this[i] && this[i].Fn && this[i].Fn.JavaScriptCommonTemplates && this[i].Extend )
				this[i].Extend(jct[i]);
			else if(this.Fn.Reserve.indexOf(','+i+',')==-1)//防止保留成员被覆盖
				this[i]=jct[i];
		}
		if(typeof jct.ERun=='function')
			jct.ERun.apply(this,args||[]);
		return this;
	},
	ExtendTo:function(jct,args){//附加到其他对象上
		for (var i in this){
			if(this.Fn.Reserve.indexOf(','+i+',')>0 && jct[i]) continue;
			if(jct[i]==null)
				jct[i]=this[i];
			else if(this[i].Fn && this[i].Fn.JavaScriptCommonTemplates && this[i].ExtendTo)
				this[i].ExtendTo(jct[i]);
		}
		if(typeof jct.ERun=='function') jct.ERun.apply(jct,args||[]);
		return this;
	},
	ExecChilds:function(childs,exec){//执行childs对象所列成员里的某个方法，默认是Exec方法
		if(typeof childs=='string'){
			exec=childs;
			childs=0;
		}
		exec=exec||'Exec';
		if(!childs){
			childs={};
			for (var c in this)
				if(this[c].Fn && this[c].Fn.JavaScriptCommonTemplates)
					childs[c]=[];
		}
		for(var c in childs)
			if(this[c] && (typeof this[c][exec]=='function')){
				this[c][exec].apply(this[c],childs[c]);
		}
		return this;
	},
	BuildChilds:function(childs){//构建子jCT对象,并执行RunNow
		var cs={},withargs=false;
		if(undefined==childs) childs=[];
		else if (typeof childs=='string') childs=childs.split(',');
		else {
			cs=childs;//childs is object and with arguments array.
			withargs=true;
		}
		if(childs instanceof Array)
			for(var i=0;i<childs.length;i++) cs[childs[i]]=true;
		for (var i in this)
		if(this[i].Fn && this[i].Fn.JavaScriptCommonTemplates && (childs.length==0 || cs[i]))
		this[i].Build(withargs?childs[i]:[]);
		return this;
	},
	GetView:function()
	{
		this.Fn.V=[];
		this.GetViewContinue.apply(this,arguments);
		return this.Fn.V.join('');
	},//得到装配数据后的视图
	GetViewContinue:function()
	{
		this.Build.apply(this,[arguments]);
	},//得到装配数据后的视图
	Build:function(args){//构建实例
		this.Fn.Build(this,args,arguments.callee.caller===this.GetViewContinue);
		return this;
	},
	PushView:function(txt){
		this.Fn.V.push(txt);
	}
};
jCT.Instance=function(txt,path){
	this.Init(txt,path);
};
jCT.clearWhiteSpace=true;
jCT.Instance.prototype={
	JavaScriptCommonTemplates:3.0,
	Reserve:',',//保留成员
	args:[],//GetView的参数
	Tags:{//几种不同的模板定义风格
		comment:{//注释标签风格
			block:{begin:'<!---',end:'-->'},//语法块标记
			exp:{begin:'+-',end:'-+'},//取值表达式
			member:{begin:'/*+',end:'*/'},//定义成员语法标记
			memberend:{begin:'/*-',end:'*/'},//定义成员结束语法标记
			clean:{begin:'<!--clean',end:'/clean-->'}//清理标记
		},
		script:{//脚本标签风格
			block:{begin:'<script type="text/jct">',end:'</script>'},
			exp:{begin:'+-',end:'-+'},
			member:{begin:'/*+',end:'*/'},
			memberend:{begin:'/*-',end:'*/'},
			clean:{begin:'<!--clean',end:'/clean-->'}
		},
		code:{//code标签风格
			block:{begin:'<code class="jct">',end:'</code>'},
			exp:{begin:'+-',end:'-+'},
			member:{begin:'/*+',end:'*/'},
			memberend:{begin:'/*-',end:'*/'},
			clean:{begin:'<!--clean',end:'/clean-->'}
		}
	},
	Init:function(txt,path){
		this.Src=txt||'';
		this.Path=path||'';
		for (var tag in this.Tags)//自动判断模板风格
			if (this.Src.indexOf(this.Tags[tag].block.begin)>=0) break;
		this.Tag=this.Tags[tag];
		this.A=[];//由src转换的模板数组
		this.V=[];//执行的文本结果,以数组形式存放
		this.EXEC=[];//
		var a=[];
		var p=[0,0,0,0,0];
		var max=this.Src.length;
		while (this.Slice(this.Tag.clean,p[4],p,max))
			a.push(this.Src.slice(p[0],p[1]));
		if(a.length){
			a.push(this.Src.slice(p[4]));
			this.Src = a.join('');
		}
	},
	Build:function(self,args,getview){
		this.EXEC=[];
		this.Parse(self);
		try{
			var code=this.EXEC.join('\n');
			self.GetViewContinue=new Function(this.args,code);
			this.Src='';
		}catch (ex){
			this.V=['jCT Parse Error'];
			self.ERROR={message:ex.message + '\n'+ (ex.lineNumber || ex.number),code:code};
		}
		if(self.BRun)
			self.BRun.apply(self,args||[]);
		if(getview){
			this.V=[];
			self.GetViewContinue.apply(self,args||[]);
		}
	},
	Parse:function(self){
		var tag = this.Tag,A = this.A,E=this.EXEC,max= this.Src.length,p=[0,0,0,0,0],p1=[0,0,0,0,0];
		while (this.Slice(tag.block,p[4],p,max)){//语法分2段
			p1=[0,0,0,0,p[0]];
			while (this.Slice(tag.exp,p1[4],p1,p[1])){//处理取值表达式
				E.push('this.Fn.V.push(this.Fn.A['+A.length+']);');
				A.push(this.Src.slice(p1[0],p1[1]));
				E.push('this.Fn.V.push('+this.Src.slice(p1[2],p1[3])+');');
			}
			if(p1[4]!=p[1]){
				E.push('this.Fn.V.push(this.Fn.A['+A.length+']);');
				A.push(this.Src.slice(p1[4],p[1]));
			}
			if(this.Src.slice(p[2],p[2]+2)=='//'){//处理扩展语法
				var str=this.Src.slice(p[2]+2,p[2]+3);
				if (str=='/'){//子模板
					str=this.Src.slice(p[2]+3,p[3]);
					var argspos=str.indexOf(' ');
					var args=[];
					if(argspos>0){
						args=str.slice(argspos+1).split(',');
						str=str.slice(0,argspos);
					}
					var child=tag.block.begin+'///'+str+tag.block.end;
					var tmp = this.Src.indexOf(child,p[4]);
					if (tmp>0){
						var njct=new jCT(this.Src.slice(p[4],tmp),this.Path);
						njct.Fn.args=args;
						if(!self[str]) self[str]={};
						for (var j in njct) 
							self[str][j]=njct[j];
						p[4] = tmp + child.length;
					}
				}else if (str=='.'){//成员对象
					str=this.Src.slice(p[2]+3,p[3]);
					var argspos=str.indexOf(' ')+1;
					if(str.slice(argspos,argspos+8)=='function'){
						var obj=str.slice(0,argspos-1);
						self[obj]=new Function('return '+str.slice(argspos,str.length))();
					}else{
						var obj=new Function('return '+str.slice(argspos));
						self[str.slice(0,argspos)]=obj.call(self);
					}
				}else if (str==' '){//GetView参数定义
					this.args=this.Src.slice(p[2]+2,p[3]).slice(1).split(',');
				}
			}else//javascript语句
				E.push(this.Src.slice(p[2],p[3]));
		}
		p1=[0,0,0,0,p[4]];p[1]=max;
		while (this.Slice(tag.exp,p1[4],p1,p[1])){//处理取值表达式
			E.push('this.Fn.V.push(this.Fn.A['+A.length+']);');
			A.push(this.Src.slice(p1[0],p1[1]));
			E.push('this.Fn.V.push('+this.Src.slice(p1[2],p1[3])+');');
		}
		if(p1[4]!=p[1]){
			E.push('this.Fn.V.push(this.Fn.A['+A.length+']);');
			A.push(this.Src.slice(p1[4],p[1]));
		}
	},
	Slice:function(tn,b1,p,max){//把string第2段分成2段
		var begin=tn.begin;
		var end=tn.end;
		var e1,b2,e2;
		e1=this.Src.indexOf(begin,b1);
		if (e1<0 || e1>=max) return false;
		b2=e1+begin.length;
		if (b2<0 || b2>=max) return false;
		e2=this.Src.indexOf(end,b2);
		if (e2<0 || e2>=max) return false;
		p[0]=b1;p[1]=e1;
		p[2]=b2;p[3]=e2;
		p[4]=e2+end.length;
		return true;
	}
};

// modified by KEN 2011-11-19
global.jCT = jCT;