async(page)=>{
const results=[];
for(const width of [1440,390]){
await page.setViewportSize({width,height:900});
for(const close of ['Escape','Cancel']){
await page.getByRole('button',{name:'Delete',exact:true}).click();
const opened=await page.getByRole('alertdialog').isVisible();
if(close==='Escape')await page.keyboard.press('Escape');
else await page.getByRole('alertdialog').getByRole('button',{name:'Cancel',exact:true}).click();
await page.getByRole('alertdialog').waitFor({state:'hidden'});
results.push({width,close,opened,triggerFocused:await page.getByRole('button',{name:'Delete',exact:true}).evaluate(e=>e===document.activeElement),active:await page.evaluate(()=>document.activeElement.tagName)});
}
}
await page.getByRole('button',{name:'Cancel',exact:true}).click();
return results;
}
