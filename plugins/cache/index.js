module.exports = {
    async onPreBuild(event) {
        await event.utils.cache.restore("cache");
    },
    async onPostBuild(event) {
        await event.utils.cache.save("cache");
    },
}