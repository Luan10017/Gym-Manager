const fs = require('fs')
const data = require('../data.json')
const { date } = require('../utils')
const Intl = require('intl')

exports.index = function(req, res) {
    return res.render('members/index', {members: data.members})
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

    

    birth = Date.parse(req.body.birth)

    let id = 1
    const lastMember = data.members[data.members.length - 1]
    if (lastMember) {
        id = lastMember.id + 1
    }

    data.members.push({
        id,
        ...req.body,
        birth, 
    })

    fs.writeFile("data.json", JSON.stringify(data,null,2), function(err){
        if (err) return res.send("Write file error!")
    
        return res.redirect("/members")
    })


    //return res.send(req.body)
}

//show
exports.show = function(req, res) {
    const { id } = req.params

    const foundMember = data.members.find(function(members){
        return members.id == id
    })
    if (!foundMember) return res.send('Members not found')

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).birthDay
    }

    return res.render('members/show', {member})
}

//edit
exports.edit =function(req, res) {
    const { id } = req.params

    const foundMember = data.members.find(function(members){
        return members.id == id
    })
    if (!foundMember) return res.send('Members not found')
    
    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso
    
    }


    return res.render('members/edit', { member})
}

//update

//put
exports.put = function(req, res) {
    const { id } = req.body
    let index = 0

    const foundMembers = data.members.find(function(members, foundIndex){
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

    data.members[index] = members

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('write error!')

        return res.redirect(`members/${id}`)
    })
}

//delete

exports.delete = function(req, res) {
    const { id } = req.body
    const filteredMemberss = data.members.filter(function(members) {
        return members.id != id
    })

    data.members = filteredMemberss

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('Write file error')

        return res.redirect("/members")
    })
}