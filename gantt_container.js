const container = document.querySelector('.container'); 
        
        container.addTopbar= function(title){
           
            const topbar = document.createElement('div');
            topbar.classList.add('topbar');
            topbar.innerHTML = `
                <div>${title}</div>
                <div class="legenda">
                    Legenda:
                    <div><span class="dot green"></span> Conforme planejado </div>
                    <div><span class="dot yellow"></span> Alerta </div>
                    <div><span class="dot orange"></span> Atrasado </div>
                    <div><span class="dot red"></span> Crítico </div>
                </div>
            `;
            container.appendChild(topbar);
        }
        container.addTopbar('Plano de atividade 2025');


    container.getStart = function(activities){
        let minimum_date=activities.reduce((a,b)=>{
            return a.base_initial_date < b.base_initial_date ? a : b
        }).base_initial_date;

        return minimum_date;
    }

    container.getEnd=function(activities){
        let maximum_date=activities.reduce((a,b)=>{
            return a.base_final_date > b.base_final_date ? a : b
        }).base_final_date;

        return maximum_date
      
    }


    container.getMonthsBetween= function(activities) {
    const d1 = this.getStart(activities);
    const d2 = this.getEnd(activities);
    let start =new Date(d1);
    let end = new Date(d2);
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
    /*<table>
        <tr>
            <th class="col1">Atividade</th>
            <th class="col2">Status</th>
            <th class="col3">Progresso</th>            
            <th class="monthshead">Jul/25</th>
            <th class="monthshead">Aug/25</th>
            <th class="monthshead">Sep/25</th>
            <th class="monthshead">Oct/25</th>
            <th class="monthshead">Nov/25</th>
            <th class="monthshead">Dec/25</th>

        </tr>
        </table>*/
    container.addTable=function(activities){
        const table=document.createElement('table');
        const months=this.getMonthsBetween(activities);
        const start=this.getStart(activities);
        console.log("Start= ",start);
        const end=this.getEnd(activities);
        table.addhead=function(activities,months){
             let htmlx=`
            <thead>
                <tr>
                    <th class="title">Atividade</th>
                    <th  class="title">Status</th>
                    <th class="title">Progresso</th>
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
           const d1 = new Date(start);
           console.log("Start d1= ",d1)

           const d2 = new Date(end);
           activities.forEach(activity => {

            function get_plan_info(activity){
               const plan_d1 = new Date(activity.base_initial_date);
               const plan_d2 = new Date(activity.base_final_date);
              
               const delay_ms=(plan_d1-d1)
               const delay_months=(delay_ms)/(1000*60*60*24*30);
               const width_ms=plan_d2-plan_d1;
               const width_months=(width_ms)/(1000*60*60*24*30);
               return [delay_months,width_months];

            }
            const[plan_delay,plan_width]=get_plan_info(activity);

            function get_exec_info(activity){
                console.log(activity)
                const exec_d1 = new Date(activity.exe_inicial_date);
                const exec_d2 = new Date(activity.exe_final_date);
                console.log("Exec d1= ",exec_d1)
                console.log("Exec d2= ",exec_d2)
                const today= new Date();

               const delay_ms=(exec_d1-d1)
               const delay_months=(delay_ms)/(1000*60*60*24*30);
               const width_ms=today-exec_d1;
               const width_months=(width_ms)/(1000*60*60*24*30);
               console.log("Exec delay months= ",delay_months);
               console.log("Exec width months= ",width_months);
               return [delay_months,width_months];
           }
           const[exec_delay,exec_width]=get_exec_info(activity);

               let htmlx=`
                   <tr>
                       <td class="col1">${activity.name}</td>
                       <td class="col2">${activity.status}</td>
                       <td class="col3"><div class="status"><span class="dot red"> </span></div></td>
                       <td colspan="24">
                           <div class="bar planbar" style="margin-left: calc(100% / 12 * ${plan_delay});width: calc(100% / 12 * ${plan_width});"></div>
                           <div class="bar actualbar"style="margin-left: calc(100% / 12 * ${exec_delay});width: calc(100% / 12 * ${exec_width});background-image:linear-gradient(to right, rgb(3, 87, 3) 0%, rgb(3, 87, 3) 100%);" ></div>
                       </td>            
                   </tr>
               `;
               this.innerHTML+=htmlx;
           });
        }

        table.addLines(activities,start,end);

        container.appendChild(table);
    }