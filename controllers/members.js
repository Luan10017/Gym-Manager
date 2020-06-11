const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils')
const Intl = require('intl')

exports.index = function(req, res) {
    return res.render('memberss/index', {memberss: data.memberss})
}

//show
exports.show = function(req, res) {
    const { id } = req.params

    const foundMembers = data.memberss.find(function(members){
        return members.id == id
    })
    if (!foundMembers) return res.send('Members not found')

    const members = {
        ...foundMembers,
        age: age(foundMembers.birth),
    }

    return res.render('memberss/show', {members})
}

/* CREAT */
exports.create = function(req, res) {
    return res.render('members/create')
}



// POST
exports.post = function(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "")
            return res.send('Please, fill all fields.')
    }

    let {avatar_url, birth, name, services, gender} = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.memberss.length + 1)

    data.memberss.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    })

    fs.writeFile("data.json", JSON.stringify(data,null,2), function(err){
        if (err) return res.send("Write file error!")
    
        return res.redirect("/memberss")
    })


    //return res.send(req.body)
}

//edit
exports.edit =function(req, res) {
    const { id } = req.params

    const foundMembers = data.memberss.find(function(members){
        return members.id == id
    })
    if (!foundMembers) return res.send('Members not found')
    
    const members = {
        ...foundMembers,
        birth: date(foundMembers.birth)
    
    }


    return res.render('memberss/edit', { members})
}

//update

//put
exports.put = function(req, res) {
    const { id } = req.body
    let index = 0

    const foundMembers = data.memberss.find(function(members, foundIndex){
        if (id == members.id){
            index = foundIndex
            return true
        } 
    })
    if (!foundMembers) return res.send('Members not found')

    const members = {
        ...foundMembers,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.memberss[index] = members

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('write error!')

        return res.redirect(`memberss/${id}`)
    })
}

//delete

exports.delete = function(req, res) {
    const { id } = req.body
    const filteredMemberss = data.memberss.filter(function(members) {
        return members.id != id
    })

    data.memberss = filteredMemberss

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('Write file error')

        return res.redirect("/memberss")
    })
}