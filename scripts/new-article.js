'use stricts'

const fs = require('fs')
const inquirer = require('inquirer')
const v = require('voca')
const dateFns = require('date-fns')

const currentTime = new Date()
const date = dateFns.format(currentTime, 'YYYY-MM-DD')
const time = dateFns.format(currentTime, 'YYYY-MM-DD HH:mm:ss ZZ')

const prompts = [
  {
    type: 'input',
    name: 'title',
    message: 'What\'s your post title',
    validate: value => value ? true : 'Title is required.',
    filter: value => v.trim(value)
  },
  {
    type: 'input',
    name: 'fileName',
    message: 'What\'s your file name',
    validate: value => value ? true : 'File name is required.',
    filter: value => `${date}-${v.kebabCase(v.lowerCase(v.trim(value)))}.md`
  },
  {
    type: 'checkbox',
    name: 'tags',
    message: 'Select tags:',
    choices: [
      'Ruby on Rails',
      'Ruby',
      'JavaScript',
      'Design',
      'Tool',
      'Thought'
    ]
  },
  {
    type: 'confirm',
    name: 'isDraft',
    message: 'Is this post draft?',
    default: true
  }
]

inquirer.prompt(prompts).then(answers => {
  const content =
`---
layout: post
title: ${answers.title}
date: ${time}
tags:
${answers.tags.map(tag => '  - ' + tag).join('\n')}
categories:
---\n`

  const folder = answers.isDraft ? '_drafts' : '_posts'
  fs.writeFileSync(`${folder}/${answers.fileName}`, content)
})
