var Decoder={};Decoder.rsDecoder=new ReedSolomonDecoder(GF256.QR_CODE_FIELD),Decoder.correctErrors=function(r,e){for(var o=r.length,a=new Array(o),d=0;d<o;d++)a[d]=255&r[d];var t=r.length-e;try{Decoder.rsDecoder.decode(a,t)}catch(r){throw r}for(d=0;d<e;d++)r[d]=a[d]},Decoder.decode=function(r){for(var e=new BitMatrixParser(r),o=e.readVersion(),a=e.readFormatInformation().ErrorCorrectionLevel,d=e.readCodewords(),t=DataBlock.getDataBlocks(d,o,a),c=0,n=0;n<t.length;n++)c+=t[n].NumDataCodewords;for(var D=new Array(c),s=0,w=0;w<t.length;w++){var i=t[w],l=i.Codewords,f=i.NumDataCodewords;Decoder.correctErrors(l,f);for(n=0;n<f;n++)D[s++]=l[n]}return new QRCodeDataBlockReader(D,o.VersionNumber,a.Bits)};