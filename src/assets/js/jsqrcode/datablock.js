function DataBlock(o,r){this.numDataCodewords=o,this.codewords=r,this.__defineGetter__("NumDataCodewords",function(){return this.numDataCodewords}),this.__defineGetter__("Codewords",function(){return this.codewords})}DataBlock.getDataBlocks=function(o,r,e){if(o.length!=r.TotalCodewords)throw"ArgumentException";for(var t=r.getECBlocksForLevel(e),d=0,n=t.getECBlocks(),a=0;a<n.length;a++)d+=n[a].Count;for(var s=new Array(d),c=0,w=0;w<n.length;w++){var f=n[w];for(a=0;a<f.Count;a++){var l=f.DataCodewords,i=t.ECCodewordsPerBlock+l;s[c++]=new DataBlock(l,new Array(i))}}for(var h=s[0].codewords.length,C=s.length-1;C>=0;){if(s[C].codewords.length==h)break;C--}C++;var u=h-t.ECCodewordsPerBlock,g=0;for(a=0;a<u;a++)for(w=0;w<c;w++)s[w].codewords[a]=o[g++];for(w=C;w<c;w++)s[w].codewords[u]=o[g++];var k=s[0].codewords.length;for(a=u;a<k;a++)for(w=0;w<c;w++){var v=w<C?a:a+1;s[w].codewords[v]=o[g++]}return s};