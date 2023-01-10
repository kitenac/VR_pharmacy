import axios from 'axios';  


// ideal doc on configuring axios-instance: https://axios-http.com/docs/req_config 
export const AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_ADDRESS ?? 'http://51.250.38.136:8001/api/v1.0',
    
    redirect: 'follow',
});



const defaultParams = {
    limit: 10,
    page: 1,
    order: ['-id']
}
const defaultHeaders = {
    "Content-Type": "application/json"
} 

// geting all group`s students quests 
// "params" - to searchAPI parametrs - to configure pagesize, pagenumber 
async function API({url, 
                         requestOptions={},
                         params=defaultParams,
                         headers=defaultHeaders,
                         method='post'}) {
    let res
    try{ 
        method !== 'get' ? 
        res = await AxiosInstance[method](url, 
                                          JSON.stringify(requestOptions), 
                                          {
                                           headers: headers,
                                           params: params
                                          }):
        res = await AxiosInstance['get'](url, {params: params})             // axios.get() has different signature( params are in 2nd arg) 
    }
    catch(err){
        console.log('error', err)
    }
    
    console.log('Hello from POST-based searchAPI:', res.data)
    return res.data // res.data = {data, meta} | meta - about paging and other stuff 
}


export async function getStudents({groupID, params=defaultParams, optional={search: '', sort: {col: '-full_name', direction: 'asc'} }}){
    // handling emty initialized sort
    if(optional.sort !== null) optional.sort = {col: '-full_name', direction: 'asc'}
    const {col, direction} = optional.sort

    const options = {  
        "filter":[ {
             "column": "group_id",
             "value": groupID
            },
        ],
    }

    if (optional.search !== '' && optional.search){ 
        options["filter"] = [
        { 
            "column": 'full_name', 
            "operator": 'ilike', 
            "value": '%' + optional.search + '%'
        }]
    }

    return await API({url: `students/search`, requestOptions: options, params: {...params, order: [col]}})
}


export async function getGroups({params=defaultParams, optional={search: '', sort: {col: '-name', direction: 'asc'} } }){
    
    if(optional.sort !== null) optional.sort = {col: '-name', direction: 'asc'}
    const {col, direction} = optional.sort

    // for each group fetching all students - to know how many students in group
    let options = {
        "with": {
          "relationships": [
            "students"
          ]
        }
    }

    if (optional.search !== ''){ 
        options["filter"] = [
        { 
            "column": 'name', 
            "operator": 'ilike', 
            "value": '%' + optional.search + '%'
        }]
    }


    return await API({url: `groups/search`, requestOptions: options, params: {...params, order: [col]}})
}


export async function Add(endpoint, options){
    return await API({url: endpoint, requestOptions: options})
}


export async function Modify(endpoint, options, id){
    return await API({url: `${endpoint}/${id}`, method: 'put', requestOptions: options})
}


export async function Del(endpoint, id){
    await API({url: `${endpoint}/${id}`, method: 'delete'})
}

// search can be used as in getGroups if need 
export async function getQuests({params=defaultParams, optional={search: '' }}){
    return await API({url: 'quests/search', params: params})
}


export async function getProgress(groupID, questID){
    console.log('getProgress params: ', groupID, questID)
    return await API({url: 'progress/get', method: 'get', params: {group_id: groupID, quest_id: questID}})
}


                                                  
//const res = await getGroups()
//const res = await getQuests('7a731117-6b6d-45cb-b7c2-8942aa357bdd')
//console.log('Can u see me?\n', res)