import { useState } from "react";
import { Search } from "lucide-react";

const emojiCategories = [
  {
    name: "Happy Faces",
    emojis: [
      { emoji: "😀", name: "Grinning Face", meaning: "Classic happy face showing joy" },
      { emoji: "😃", name: "Grinning Face with Big Eyes", meaning: "Happy and excited" },
      { emoji: "😄", name: "Grinning Face with Smiling Eyes", meaning: "Very happy and cheerful" },
      { emoji: "😁", name: "Beaming Face with Smiling Eyes", meaning: "Happy and proud" },
      { emoji: "😆", name: "Grinning Squinting Face", meaning: "Laughing hard with closed eyes" },
      { emoji: "😅", name: "Grinning Face with Sweat", meaning: "Happy but also relieved or nervous" },
      { emoji: "🤣", name: "Rolling on the Floor Laughing", meaning: "Something is extremely funny" },
      { emoji: "😂", name: "Face with Tears of Joy", meaning: "So funny that you're crying" },
      { emoji: "🙂", name: "Slightly Smiling Face", meaning: "A little happy or being friendly" },
      { emoji: "😊", name: "Smiling Face with Smiling Eyes", meaning: "Genuine happiness and warmth" },
      { emoji: "😇", name: "Smiling Face with Halo", meaning: "Innocent or angelic" },
      { emoji: "🥰", name: "Smiling Face with Hearts", meaning: "Loving and appreciative" },
      { emoji: "😍", name: "Smiling Face with Heart-Eyes", meaning: "In love or admiring something" },
      { emoji: "🤩", name: "Star-Struck", meaning: "Excited and amazed" },
      { emoji: "😋", name: "Face Savoring Food", meaning: "Food is delicious or being silly" }
    ]
  },
  {
    name: "Love & Affection",
    emojis: [
      { emoji: "🥰", name: "Smiling Face with Hearts", meaning: "Feeling loved and happy" },
      { emoji: "😘", name: "Face Blowing a Kiss", meaning: "Sending love or affection" },
      { emoji: "😗", name: "Kissing Face", meaning: "Showing affection or friendship" },
      { emoji: "😚", name: "Kissing Face with Closed Eyes", meaning: "Sweet and innocent kiss" },
      { emoji: "😙", name: "Kissing Face with Smiling Eyes", meaning: "Happy and affectionate" },
      { emoji: "🤗", name: "Hugging Face", meaning: "Offering a hug or feeling loved" },
      { emoji: "🫂", name: "People Hugging", meaning: "Showing support and care" },
      { emoji: "💝", name: "Heart with Ribbon", meaning: "Gift of love" },
      { emoji: "💖", name: "Sparkling Heart", meaning: "Excited love and sparkly feelings" },
      { emoji: "💗", name: "Growing Heart", meaning: "Increasing love or touched" }
    ]
  },
  {
    name: "Fun & Playful",
    emojis: [
      { emoji: "🤪", name: "Zany Face", meaning: "Wild, crazy, or goofy" },
      { emoji: "😛", name: "Face with Tongue", meaning: "Playful or silly" },
      { emoji: "😜", name: "Winking Face with Tongue", meaning: "Joking around" },
      { emoji: "🤭", name: "Face with Hand Over Mouth", meaning: "Giggling or embarrassed" },
      { emoji: "🫢", name: "Face with Open Eyes and Hand Over Mouth", meaning: "Surprised gasp" },
      { emoji: "🤫", name: "Shushing Face", meaning: "Keeping a secret" },
      { emoji: "🤔", name: "Thinking Face", meaning: "Pondering or questioning" },
      { emoji: "🫡", name: "Saluting Face", meaning: "Showing respect playfully" },
      { emoji: "🤨", name: "Face with Raised Eyebrow", meaning: "Skeptical or questioning" },
      { emoji: "😏", name: "Smirking Face", meaning: "Flirting or joking" }
    ]
  },
  {
    name: "Sleepy & Tired",
    emojis: [
      { emoji: "😴", name: "Sleeping Face", meaning: "Sleeping or very tired" },
      { emoji: "🥱", name: "Yawning Face", meaning: "Tired or bored" },
      { emoji: "😪", name: "Sleepy Face", meaning: "Tired or drowsy" },
      { emoji: "😮‍💨", name: "Face Exhaling", meaning: "Relief or tired sigh" },
      { emoji: "😵‍💫", name: "Face with Spiral Eyes", meaning: "Dizzy or overwhelmed" },
      { emoji: "🤤", name: "Drooling Face", meaning: "Sleepy or desiring something" },
      { emoji: "😫", name: "Tired Face", meaning: "Exhausted or frustrated" },
      { emoji: "😩", name: "Weary Face", meaning: "Exhausted or dramatically tired" },
      { emoji: "🥴", name: "Woozy Face", meaning: "Tired or slightly drunk" },
      { emoji: "😵", name: "Dizzy Face", meaning: "Confused or overwhelmed" }
    ]
  },
  {
    name: "Sad & Crying",
    emojis: [
      { emoji: "🥺", name: "Pleading Face", meaning: "Begging or touched" },
      { emoji: "😢", name: "Crying Face", meaning: "Sad with a tear" },
      { emoji: "😭", name: "Loudly Crying Face", meaning: "Very sad or dramatic crying" },
      { emoji: "😿", name: "Crying Cat", meaning: "Sad cat face" },
      { emoji: "😥", name: "Sad but Relieved Face", meaning: "Disappointed but relieved" },
      { emoji: "😓", name: "Downcast Face with Sweat", meaning: "Sad and anxious" },
      { emoji: "🥹", name: "Face Holding Back Tears", meaning: "Trying not to cry" },
      { emoji: "😔", name: "Pensive Face", meaning: "Sad and reflective" },
      { emoji: "😕", name: "Confused Face", meaning: "Unsure or puzzled" },
      { emoji: "🙁", name: "Slightly Frowning Face", meaning: "Mild sadness or concern" }
    ]
  },
  {
    name: "Angry & Frustrated",
    emojis: [
      { emoji: "😠", name: "Angry Face", meaning: "Mad or annoyed" },
      { emoji: "😡", name: "Pouting Face", meaning: "Very angry or rage" },
      { emoji: "🤬", name: "Face with Symbols on Mouth", meaning: "Cursing or extreme anger" },
      { emoji: "😤", name: "Face with Steam From Nose", meaning: "Frustrated or proud" },
      { emoji: "😾", name: "Pouting Cat", meaning: "Angry cat face" },
      { emoji: "👿", name: "Angry Face with Horns", meaning: "Evil or very angry" },
      { emoji: "😈", name: "Smiling Face with Horns", meaning: "Mischievous or naughty" },
      { emoji: "🤯", name: "Exploding Head", meaning: "Mind blown or overwhelmed" },
      { emoji: "😳", name: "Flushed Face", meaning: "Embarrassed or shocked" },
      { emoji: "😰", name: "Anxious Face with Sweat", meaning: "Nervous or worried" }
    ]
  },
  {
    name: "Sick & Medical",
    emojis: [
      { emoji: "🤒", name: "Face with Thermometer", meaning: "Sick with fever" },
      { emoji: "🤕", name: "Face with Head-Bandage", meaning: "Injured or hurt" },
      { emoji: "🤢", name: "Nauseated Face", meaning: "Feeling sick or disgusted" },
      { emoji: "🤮", name: "Face Vomiting", meaning: "Very sick or disgusted" },
      { emoji: "🤧", name: "Sneezing Face", meaning: "Having a cold or allergies" },
      { emoji: "😷", name: "Face with Medical Mask", meaning: "Sick or preventing illness" },
      { emoji: "🤠", name: "Cowboy Hat Face", meaning: "Happy and confident" },
      { emoji: "🥵", name: "Hot Face", meaning: "Too hot or attractive" },
      { emoji: "🥶", name: "Cold Face", meaning: "Freezing or cool" },
      { emoji: "🥴", name: "Woozy Face", meaning: "Sick or intoxicated" }
    ]
  },
  {
    name: "Faces with Objects",
    emojis: [
      { emoji: "🤓", name: "Nerd Face", meaning: "Smart or geeky" },
      { emoji: "😎", name: "Smiling Face with Sunglasses", meaning: "Cool or confident" },
      { emoji: "🧐", name: "Face with Monocle", meaning: "Analytical or sophisticated" },
      { emoji: "🥸", name: "Disguised Face", meaning: "Incognito or suspicious" },
      { emoji: "🤥", name: "Lying Face", meaning: "Not telling the truth" },
      { emoji: "🤡", name: "Clown Face", meaning: "Silly or creepy" },
      { emoji: "👻", name: "Ghost", meaning: "Playful spooky or ghosting" },
      { emoji: "🤖", name: "Robot", meaning: "Automated or mechanical" },
      { emoji: "👾", name: "Alien Monster", meaning: "Retro gaming or space" },
      { emoji: "👽", name: "Alien", meaning: "Extraterrestrial or strange" }
    ]
  },
  {
    name: "Face Reactions",
    emojis: [
      { emoji: "🫣", name: "Face with Peeking Eye", meaning: "Curious but shy" },
      { emoji: "🫠", name: "Melting Face", meaning: "Hot or overwhelmed" },
      { emoji: "🫥", name: "Dotted Line Face", meaning: "Invisible or ignored" },
      { emoji: "🤐", name: "Zipper-Mouth Face", meaning: "Keeping quiet" },
      { emoji: "🫤", name: "Face with Diagonal Mouth", meaning: "Skeptical or unsure" },
      { emoji: "🥲", name: "Smiling Face with Tear", meaning: "Smiling through pain" },
      { emoji: "😶‍🌫️", name: "Face in Clouds", meaning: "Confused or lost in thoughts" },
      { emoji: "😮", name: "Face with Open Mouth", meaning: "Surprised or shocked" },
      { emoji: "😯", name: "Hushed Face", meaning: "Surprised or speechless" },
      { emoji: "😦", name: "Frowning Face with Open Mouth", meaning: "Shocked and concerned" }
    ]
  },
  {
    name: "Love & Hearts",
    emojis: [
      { emoji: "❤️", name: "Red Heart", meaning: "Love and affection" },
      { emoji: "🧡", name: "Orange Heart", meaning: "Friendship and caring" },
      { emoji: "💛", name: "Yellow Heart", meaning: "Happiness and friendship" },
      { emoji: "💚", name: "Green Heart", meaning: "Nature and luck" },
      { emoji: "💙", name: "Blue Heart", meaning: "Trust and harmony" },
      { emoji: "💜", name: "Purple Heart", meaning: "Nobility and spirituality" },
      { emoji: "🖤", name: "Black Heart", meaning: "Dark humor or grief" },
      { emoji: "🤍", name: "White Heart", meaning: "Pure love and clean intentions" },
      { emoji: "💝", name: "Heart with Ribbon", meaning: "A gift of love" },
      { emoji: "💘", name: "Heart with Arrow", meaning: "Falling in love" }
    ]
  },
  {
    name: "People & Body",
    emojis: [
      { emoji: "👋", name: "Waving Hand", meaning: "Hello or goodbye" },
      { emoji: "🤚", name: "Raised Back of Hand", meaning: "Stop or high five" },
      { emoji: "✋", name: "Raised Hand", meaning: "Stop or high five" },
      { emoji: "👌", name: "OK Hand", meaning: "Approval or agreement" },
      { emoji: "🤌", name: "Pinched Fingers", meaning: "Italian hand gesture or 'what do you mean?'" },
      { emoji: "👍", name: "Thumbs Up", meaning: "Approval or agreement" },
      { emoji: "👎", name: "Thumbs Down", meaning: "Disapproval or disagreement" },
      { emoji: "✌️", name: "Victory Hand", meaning: "Peace or victory" },
      { emoji: "🤞", name: "Crossed Fingers", meaning: "Good luck or hoping" },
      { emoji: "🤝", name: "Handshake", meaning: "Agreement or deal" }
    ]
  },
  {
    name: "Nature & Animals",
    emojis: [
      { emoji: "🐶", name: "Dog Face", meaning: "Loyal friend or pet dog" },
      { emoji: "🐱", name: "Cat Face", meaning: "Pet cat or feline qualities" },
      { emoji: "🦁", name: "Lion", meaning: "Strength or leadership" },
      { emoji: "🐯", name: "Tiger Face", meaning: "Fierce or wild" },
      { emoji: "🦊", name: "Fox", meaning: "Clever or cunning" },
      { emoji: "🦋", name: "Butterfly", meaning: "Beauty or transformation" },
      { emoji: "🌺", name: "Hibiscus", meaning: "Beautiful flower" },
      { emoji: "🌳", name: "Deciduous Tree", meaning: "Nature or environment" },
      { emoji: "🌙", name: "Crescent Moon", meaning: "Night time or sleep" },
      { emoji: "⭐", name: "Star", meaning: "Success or favorite" }
    ]
  },
  {
    name: "Food & Drink",
    emojis: [
      { emoji: "🍕", name: "Pizza", meaning: "Pizza or Italian food" },
      { emoji: "🍔", name: "Hamburger", meaning: "Fast food or American cuisine" },
      { emoji: "🍟", name: "French Fries", meaning: "Fast food side dish" },
      { emoji: "🌮", name: "Taco", meaning: "Mexican food" },
      { emoji: "🍜", name: "Steaming Bowl", meaning: "Noodles or Asian cuisine" },
      { emoji: "☕", name: "Hot Beverage", meaning: "Coffee or tea" },
      { emoji: "🍺", name: "Beer Mug", meaning: "Beer or celebration" },
      { emoji: "🍷", name: "Wine Glass", meaning: "Wine or sophistication" },
      { emoji: "🍰", name: "Shortcake", meaning: "Dessert or celebration" },
      { emoji: "🍎", name: "Red Apple", meaning: "Healthy food or education" }
    ]
  },
  {
    name: "Travel & Places",
    emojis: [
      { emoji: "✈️", name: "Airplane", meaning: "Travel or vacation" },
      { emoji: "🚗", name: "Car", meaning: "Driving or road trip" },
      { emoji: "🏠", name: "House", meaning: "Home or residence" },
      { emoji: "🏢", name: "Office Building", meaning: "Work or business" },
      { emoji: "🗽", name: "Statue of Liberty", meaning: "New York or freedom" },
      { emoji: "🗼", name: "Tokyo Tower", meaning: "Japan or landmark" },
      { emoji: "🎡", name: "Ferris Wheel", meaning: "Amusement park or fun" },
      { emoji: "⛰️", name: "Mountain", meaning: "Nature or challenge" },
      { emoji: "🌊", name: "Water Wave", meaning: "Ocean or surfing" },
      { emoji: "🌅", name: "Sunrise", meaning: "Morning or new beginning" }
    ]
  },
  {
    name: "Activities & Sports",
    emojis: [
      { emoji: "⚽", name: "Soccer Ball", meaning: "Soccer/football" },
      { emoji: "🏀", name: "Basketball", meaning: "Basketball sport" },
      { emoji: "🎾", name: "Tennis", meaning: "Tennis sport" },
      { emoji: "🎮", name: "Video Game", meaning: "Gaming" },
      { emoji: "🎨", name: "Artist Palette", meaning: "Art and creativity" },
      { emoji: "🎭", name: "Performing Arts", meaning: "Theater or drama" },
      { emoji: "🎪", name: "Circus Tent", meaning: "Entertainment or performance" },
      { emoji: "🎯", name: "Direct Hit", meaning: "Accuracy or goal" },
      { emoji: "🎲", name: "Game Die", meaning: "Games or chance" },
      { emoji: "♟️", name: "Chess Pawn", meaning: "Strategy or chess" }
    ]
  },
  {
    name: "Objects & Tools",
    emojis: [
      { emoji: "📱", name: "Mobile Phone", meaning: "Smartphone or communication" },
      { emoji: "💻", name: "Laptop", meaning: "Computer or work" },
      { emoji: "⌚", name: "Watch", meaning: "Time or punctuality" },
      { emoji: "📷", name: "Camera", meaning: "Photography or memories" },
      { emoji: "🔋", name: "Battery", meaning: "Power or energy" },
      { emoji: "💡", name: "Light Bulb", meaning: "Idea or inspiration" },
      { emoji: "🔑", name: "Key", meaning: "Access or solution" },
      { emoji: "📚", name: "Books", meaning: "Education or reading" },
      { emoji: "✏️", name: "Pencil", meaning: "Writing or editing" },
      { emoji: "🎵", name: "Musical Note", meaning: "Music or sound" }
    ]
  },
  {
    name: "Symbols & Signs",
    emojis: [
      { emoji: "❗", name: "Exclamation Mark", meaning: "Important or attention" },
      { emoji: "❓", name: "Question Mark", meaning: "Question or confusion" },
      { emoji: "✅", name: "Check Mark", meaning: "Correct or done" },
      { emoji: "❌", name: "Cross Mark", meaning: "Wrong or no" },
      { emoji: "⭕", name: "Hollow Red Circle", meaning: "Correct or target" },
      { emoji: "💯", name: "Hundred Points", meaning: "Perfect score or agreement" },
      { emoji: "🔄", name: "Arrows Clockwise", meaning: "Refresh or repeat" },
      { emoji: "🔜", name: "SOON Arrow", meaning: "Coming soon" },
      { emoji: "⚠️", name: "Warning", meaning: "Caution or alert" },
      { emoji: "♾️", name: "Infinity", meaning: "Forever or unlimited" }
    ]
  },
  {
    name: "Flags & Countries",
    emojis: [
      { emoji: "🏁", name: "Chequered Flag", meaning: "Racing or finish" },
      { emoji: "🚩", name: "Triangular Flag", meaning: "Location or warning" },
      { emoji: "🎌", name: "Crossed Flags", meaning: "Celebration or event" },
      { emoji: "🏴", name: "Black Flag", meaning: "Piracy or protest" },
      { emoji: "🏳️", name: "White Flag", meaning: "Surrender or peace" },
      { emoji: "🏳️‍🌈", name: "Rainbow Flag", meaning: "LGBTQ+ pride" },
      { emoji: "🇺🇳", name: "United Nations", meaning: "International cooperation" },
      { emoji: "🎭", name: "Performing Arts", meaning: "Theater or drama" },
      { emoji: "🔰", name: "Japanese Symbol for Beginner", meaning: "New learner" },
      { emoji: "⚜️", name: "Fleur-de-lis", meaning: "Scouts or French royalty" }
    ]
  }
];

const EmojiDictionaryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCategories = emojiCategories
    .map(category => ({
      ...category,
      emojis: category.emojis.filter(emoji =>
        emoji.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emoji.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emoji.emoji.includes(searchTerm)
      )
    }))
    .filter(category => category.emojis.length > 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Emoji Dictionary</h1>
      
      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search emojis by name or meaning..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full ${
            selectedCategory === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          All
        </button>
        {emojiCategories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category.name
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Emoji Categories */}
      <div className="space-y-8">
        {filteredCategories
          .filter(
            (category) =>
              selectedCategory === "all" || category.name === selectedCategory
          )
          .map((category) => (
            <div key={category.name} className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.emojis.map((emoji) => (
                  <div
                    key={emoji.name}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors"
                  >
                    <div className="text-4xl mb-2">{emoji.emoji}</div>
                    <h3 className="font-medium text-lg mb-1">{emoji.name}</h3>
                    <p className="text-gray-400 text-sm">{emoji.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default EmojiDictionaryPage;
