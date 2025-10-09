const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res) {
  const nav = await utilities.getNav()
  const currentPath = req.originalUrl

  // Dynamic content for index.ejs
  const features = ['3 Cup holders', 'Superman doors', 'Fuzzy dice']
  const upgrades = [
    { src: 'flux-cap.png', alt: 'Flux Capacitator', caption: 'Flux Capacitator' },
    { src: 'flame.jpg', alt: 'Flame Decals', caption: 'Flame Decals' },
    { src: 'bumper_sticker.jpg', alt: 'Bumper Stickers', caption: 'Bumper Stickers' },
    { src: 'hub-cap.jpg', alt: 'Hub Caps', caption: 'Hub Caps' }
  ]
  const reviews = [
    '"So fast it\'s almost like traveling in time." (4/5)',
    '"Coolest ride on the road." (4/5)',
    '"I\'m feeling McFly!" (5/5)',
    '"The most futuristic ride of our day." (4.5/5)',
    '"80\'s livin and I love it!" (5/5)'
  ]

  res.render("index", {
    title: "Home",
    navItems,
    currentPath,
    features,
    upgrades,
    reviews,
    loggedIn: req.session?.accountId ? true : false
  })
}

module.exports = baseController
