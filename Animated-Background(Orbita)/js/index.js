var canvas,ctx,max,p,count;

window.onload=function(){
    var a,b,r;
    canvas = document.getElementsByTagName('canvas')[0];
    ctx = canvas.getContext('2d');
    canvas.width=canvas.height=400;
    ctx.fillRect(0,0,400,400);
    max=80;
    count=150;
    p=[];
    r=0;
    for(a=0;a<max;a++){
        p.push([Math.cos(r),Math.sin(r),0]);
        r+=Math.PI*2/max;
    }
    for(a=0;a<max;a++)p.push([0,p[a][0],p[a][1]]);
    for(a=0;a<max;a++)p.push([p[a][1],0,p[a][0]]);
    rus();
};

function rus(){
    var a,b,c,d,e,s,tim,p2,xp,yp,xp2,yp2,x,y,z,x1,y1,z1;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle="rgba(0,0,0,0.03)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.globalCompositeOperation = "lighter";
    tim=count/5;
    for(e=0;e<3;e++){
        tim*=1.7;
        s=1-e/3;
        a=tim/59;
        yp=Math.cos(a);
        yp2=Math.sin(a);
        a=tim/23;
        xp=Math.cos(a);
        xp2=Math.sin(a);
        p2=[];
        for(a=0;a<p.length;a++){
            x=p[a][0];y=p[a][1];z=p[a][2];
            y1=y*yp+z*yp2;
            z1=y*yp2-z*yp;
            x1=x*xp+z1*xp2;
            z=x*xp2-z1*xp;
            z1=Math.pow(2,z*s);
            x=x1*z1;
            y=y1*z1;
            p2.push([x,y,z]);
        }
        
        s*=120;
        for(d=0;d<3;d++){
            for(a=0;a<max;a++){
                b=p2[d*max+a];
                c=p2[((a+1)%max)+d*max];
                ctx.beginPath();
                ctx.strokeStyle="hsla("+((a/max*360)|0)+",70%,60%,0.15)";
                ctx.lineWidth=Math.pow(6,b[2]);
                ctx.lineTo(b[0]*s+200,b[1]*s+200);
                ctx.lineTo(c[0]*s+200,c[1]*s+200);
                ctx.stroke();
            }
        }
    }
    count++;
    requestAnimationFrame(rus);
}