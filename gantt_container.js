const container = document.querySelector('.container'); 
        
container.addTopbar= function(title){
    
    const topbar = document.createElement('div');
    topbar.classList.add('topbar');
    topbar.innerHTML = `
        <div>${title}</div>
        <div class="legenda">
            Status:
            <div><span class="dot green"></span> Conforme planejado </div>
            <div><span class="dot yellow"></span> Alerta </div>
            <div><span class="dot purple"></span> Atrasado </div>
            <div><span class="dot red"></span> Crítico </div>
        </div>
    `;
    container.appendChild(topbar);  
}

container.getStart = function(activities){
    let minimum_base_date=activities.reduce((a,b)=>{
        return a.base_initial_date < b.base_initial_date ? a : b
    }).base_initial_date;

    let minimum_exe_date=activities.reduce((a,b)=>{
        return a.exe_inicial_date < b.exe_inicial_date ? a : b
    }).exe_inicial_date;

    let minimum_date = minimum_base_date < minimum_exe_date ? minimum_base_date : minimum_exe_date;
    let today = new Date();
    //update minimum date if it is greater than today
    if(new Date(minimum_date+"T00:00:00-03:00")>today){
        minimum_date = today.getFullYear()+"-"+String(today.getMonth()+1).padStart(2,"0")+"-01";
    }


    console.log("##### GET START ######")
    console.log("Minimum date= ",minimum_date);
    const month = minimum_date.split("-")[1];
    console.log("Month= ",month);
    const year = minimum_date.split("-")[0];
    console.log("Year= ",year);
    const date = new Date(year, month-1, 1);
    console.log("Date= ",date);

    return date;
}

container.getEnd=function(activities){
    let maximum_base_date=activities.reduce((a,b)=>{
        return a.base_final_date > b.base_final_date ? a : b
    }).base_final_date;

    let maximum_exe_date=activities.reduce((a,b)=>{
        return a.exe_final_date > b.exe_final_date ? a : b
    }).exe_final_date;



    let maximum_date = maximum_base_date > maximum_exe_date ? maximum_base_date : maximum_exe_date;
    let today = new Date();
    //update maximum date if it is less than today
    if(new Date(maximum_date+"T00:00:00-03:00")<today){
        maximum_date = today.getFullYear()+"-"+String(today.getMonth()+2).padStart(2,"0")+"-01";
    }
    console.log("##### GET END ######")
    console.log("Maximum date= ", maximum_date);
    const month = maximum_date.split("-")[1];
    console.log("Month= ",month);
    const year = maximum_date.split("-")[0];
    console.log("Year= ",year);
    let date = new Date(year, month, 1);
    console.log("Date= ",date);
    date.setDate(date.getDate() - 1);
    console.log("Date= ",date);


    return date;

}

container.getMonthsBetween= function(activities) {
    const d1 = this.getStart(activities);
    const d2 = this.getEnd(activities);
    let start =d1//new Date(d1+"T00:00:00-03:00");
    let end = d2//new Date(d2+"T00:00:00-03:00");
    let months=["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //console.log(d1)
    //console.log(start)
    let monthsBetween = [];
    for(let i=start.getFullYear(); i<=end.getFullYear(); i++){
        for(let j=0; j<months.length; j++){
            let month = months[j];
            let date = new Date(i, j, 1);
            if(date >= start && date <= end){
                // make 2025 to 25
                let year = i.toString().slice(-2);
                //console.log(`${month}/${year}`);
                monthsBetween.push(`${month}/${year}`);
            }
        }
    }
    return monthsBetween;
}

container.getStatus = function (s) {
    if(s==="Conforme planejado") return "dot green";
    if(s==="Alerta") return "dot yellow";
    if(s==="Atrasado") return "dot purple";
    if(s==="Crítico") return "dot red";
}

function get_plan_info(activity,d1){
    const plan_d1 = new Date(activity.base_initial_date+"T00:00:00-03:00");
    const plan_d2 = new Date(activity.base_final_date+"T00:00:00-03:00");
    console.log("############## DATAS PLANEJADAS #########")
    console.log("Plan d1= ", plan_d1);
    console.log("Plan d2= ", plan_d2);
    console.log("D1= ",d1);
    const delay_ms = (plan_d1 - d1)
    console.log("Delay ms= ",delay_ms);
    const delay_months = (delay_ms) / (1000 * 60 * 60 * 24 * 365/12);
    console.log("Delay months= ",delay_months);
    const width_ms = plan_d2 - plan_d1;
    console.log("Width ms= ", width_ms);
    const width_days = (width_ms) / (1000 * 60 * 60 * 24);
    console.log("Width days= ",width_days);
    const width_months = (width_ms) / (1000 * 60 * 60 * 24 * 365/12);
    console.log("Width months= ", width_months);
    const delay_day = (delay_ms) / (1000 * 60 * 60 * 24);
    console.log("Delay days= ",delay_day);
    return [delay_months,width_months,width_days,delay_day];

}

function get_exec_info(activity,d1){
    //console.log(activity)
    const exec_d1 = new Date(activity.exe_inicial_date+"T00:00:00-03:00");
    const exec_d2 = new Date(activity.exe_final_date + "T00:00:00-03:00");
    console.log("############## DATAS EXECUÇÃO #########")
    console.log("Exec d1= ",exec_d1)
    console.log("Exec d2= ",exec_d2)
    const today= new Date();

    const delay_ms = (exec_d1 - d1)
    const delay_days = (delay_ms) / (1000 * 60 * 60 * 24);
    const delay_months=(delay_ms)/(1000*60*60*24*30);
    const width_ms = exec_d2 - exec_d1;
    const width_days = (width_ms) / (1000 * 60 * 60 * 24);
    const width_months=(width_ms)/(1000*60*60*24*30);
    console.log("Exec delay months= ",delay_months);
    console.log("Exec width months= ",width_months);
    return [delay_months,width_months,width_days,delay_days];
}

container.addTable=function(activities){
    const table=document.createElement('table');
    const months = this.getMonthsBetween(activities);
    console.log("Months= ",months);
    const start=this.getStart(activities);
    console.log("Start= ",start);
    const end = this.getEnd(activities);
    console.log("End= ",end);
    table.addhead=function(activities,months){
        let htmlx=`
            <thead>
            <tr>
                <th class="title left">Atividade</th>
                <th  class="title center">Status</th>
                <th class="title center">Progresso</th>
                <th class="title center">Valor MR$<br>(exec/plan)</th>

                ${months.map(month => `
                    <th class="monthshead">${month}</th>
                `).join('')}
            </tr>
            </thead>            
        `;
    
        this.innerHTML=htmlx;
    }
    table.addhead(activities,months);
    table.addLines=function(activities,start,end){        

        //create the code that replicate this standard

        console.log("############## DATAS GERAIS #########")
        const d1 = start;
        console.log("Start d1= ",d1)

        const d2 = end
        console.log("End d2= ",d2)
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log("Diff days= ", diffDays)
        console.log("###################")

        activities.forEach((activity, i) => {
            const [plan_delay, plan_width, plan_width_days, plan_delay_days] = get_plan_info(activity,d1);
            console.log("############## DATAS PLANEJADAS #########")
            console.log("Plan delay= ", plan_delay);
            console.log("Plan width= ", plan_width);
            console.log("Plan width days= ", plan_width_days);
            const [exec_delay, exec_width, exec_width_days, exec_delay_days] = get_exec_info(activity, d1);
            console.log("############## DATAS EXECUÇÃO #########")
            console.log("Exec delay= ", exec_delay);    
            console.log("Exec width= ", exec_width);
            console.log("Exec width days= ", exec_width_days);
            console.log("Exec delay days= ", exec_delay_days);
            const plan_bar_width = plan_width_days / (diffDays);
            const plan_bar_delay = plan_delay_days / (diffDays);
            const exec_bar_width = exec_width_days / (diffDays);
            const exec_bar_delay = exec_delay_days / (diffDays);

            let htmlx = `
                <tr>
                    <td class="col1 ${i % 2 === 0 ? 'gray' : ''}" >${activity.name}</td>
                    <td class="col2 ${i % 2 === 0 ? 'gray' : ''} "><div style="text-align: center"><span class="${container.getStatus(activity.status)}"></span></div></td>
                    <td class="col3 ${i % 2 === 0 ? 'gray' : ''}">${activity.progress.toFixed(0)} %</td>
                        <td class="col4 ${i % 2 === 0 ? 'gray' : ''}">${(activity.exec_value / 1000000).toFixed(0)} / ${(activity.base_value / 1000000).toFixed(0)}</td>
                    <td colspan="24" class="${i % 2 === 0 ? 'gray' : ''}">
                        <div class="bar planbar" style="margin-left: calc(100% * ${plan_bar_delay});width: calc(100% * ${plan_bar_width});" title="${activity.base_notes}"></div>
                        <div class="bar actualbar"style="margin-left: calc(100% * ${exec_bar_delay});width: calc(100% *${exec_bar_width});background-image:linear-gradient(to right, rgb(3, 87, 3) 0%, rgb(3, 87, 3) 100%);" title="${activity.exe_notes}"></div>
                    </td>            
                </tr>
            `;
//<div class="bar planbar" style="margin-left: calc(100% |* ${plan_bar_width});width: calc(100% / 12 * ${plan_width});" title="${activity.base_notes}"></div>
            this.innerHTML+=htmlx;
        });
    }

    table.addLines(activities,start,end);
    container.appendChild(table);
}
    
container.addTopbar('Plano de atividade 2025');
container.addTable(activities);