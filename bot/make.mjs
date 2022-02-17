#!/usr/bin/env zx
//import 'zx/globals'

const volatile = (await question("What's the volatile coin symbol? ")).trim().toUpperCase()
const stable = (await question("What's the stable coin symbol? ")).trim().toUpperCase()
const cloudOrError = (await question("Build for cloud or local? ")).trim().toUpperCase()

if (cloudOrError !== "cloud" && cloudOrError !== "local") {
    throw new Error("Invalid answer: must be either cloud or local, not " + cloudOrError)
}

const filename = `${volatile}${stable}_bot`

if (cloudOrError === "cloud") {
    await $`await yarn pkg:linux:cloud`
} else {
    await $`await yarn pkg:linux:local`
}

await $`mkdir -p dist/${volatile}${stable}`
await $`mv dist/linux/bot dist/${filename}`


