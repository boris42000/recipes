// Emoji for an ingredient, guessed from its name so every recipe (also future ones) gets them for free.
// Rules are checked top to bottom on the name without diacritics; the first match wins,
// so specific phrases ("arasidove maslo", "kokosove mlieko") must come before generic words ("maslo").

const RULES: [RegExp, string][] = [
  // Compound names that would otherwise hit a generic rule below
  [/arasid/, '🥜'],
  [/semien|semiac|lanove/, '🌻'],
  [/tekvic|dyn[ae]\b|dynov/, '🎃'],
  [/kokos/, '🥥'],
  [/citronova trava/, '🌿'],
  [/bujon|vyvar/, '🍲'],
  [/medovo|horcic|majonez/, '🫙'],
  [/udena paprika|sladka paprika|paliva paprika|cervena paprika|mleta paprika|cili|chilli|kajensk|sriracha/, '🌶️'],
  [/hummus/, '🫘'],
  [/pecienk/, '🍗'],
  [/kurac|kura\b/, '🍗'],
  [/slanin|prosciut|sunk/, '🥓'],
  [/klobas/, '🌭'],
  [/mas[oa]\b|mlete|hovadz|bravc|panenk/, '🥩'],
  [/losos|ryb|ancovic|tuniak|sardin/, '🐟'],
  [/krevet/, '🦐'],
  [/vajc|vajic|vajce|bielk|zltk/, '🥚'],
  [/syr|parmezan|cedar|feta|mascarpone|niva|bryndz|lucina|tvaroh|gorgonzol|ricott|mozzarell|vrsatec/, '🧀'],
  [/jogurt|skyr/, '🥣'],
  [/mliek|smotan/, '🥛'],
  [/masl|ghi|mast\b/, '🧈'],
  [/olej/, '🫒'],
  [/ocot|balzamik/, '🍶'],
  [/\bvin/, '🍷'],
  [/\bvod/, '💧'],
  [/\bmed\b/, '🍯'],
  [/sirup/, '🍁'],
  [/cokolad|kakao/, '🍫'],
  [/\bkava\b/, '☕'],
  [/cukor/, '🍬'],
  [/piskot/, '🍪'],
  [/vlock/, '🥣'],
  [/muk|struhank|krup/, '🌾'],
  [/prasok|sod[a ]|drozd/, '🫧'],
  [/ryz[aeo]?\b|ryza/, '🍚'],
  [/rezanc|nudl|udon/, '🍜'],
  [/cestovin|orzo|gnocchi|noky|tortellini|spaget/, '🍝'],
  [/tortil|plack|taco/, '🌮'],
  [/chlieb|toast|zeml|pita|bagety/, '🍞'],
  [/zemiak|hranolk/, '🥔'],
  [/mrkv/, '🥕'],
  [/rajc|paradaj|pretlak|cherry/, '🍅'],
  [/cuket|uhork/, '🥒'],
  [/brokolic/, '🥦'],
  [/avokad/, '🥑'],
  [/kukuric/, '🌽'],
  [/hrasok|fazulk/, '🫛'],
  [/fazul|cicer|sosovic/, '🫘'],
  [/hub|sampinon|hliv|hrib/, '🍄'],
  [/cibul|salotk/, '🧅'],
  [/cesnak/, '🧄'],
  [/zazvor/, '🫚'],
  [/paprik/, '🫑'],
  [/kapust|salat|spenat|\bpor\b|zeler|cvikl/, '🥬'],
  [/bazalk|koriand|petrzlen|vnat|kopor|rozmarin|tymian|salvi|oregan|majoran|fenikel|bobkov/, '🌿'],
  [/banan/, '🍌'],
  [/jablk/, '🍎'],
  [/hrusk/, '🍐'],
  [/jahod/, '🍓'],
  [/cucoried|boruvk/, '🫐'],
  [/mango/, '🥭'],
  [/citron|limet/, '🍋'],
  [/marhul|broskyn/, '🍑'],
  [/slivk|hrozien/, '🍇'],
  [/ovoc/, '🍓'],
  [/orech|mandl|liesk/, '🌰'],
  [/kapar|oliv/, '🫒'],
  [/tofu/, '🧊'],
  [/omack|pasta|kari|curry|worcest|tamarind/, '🥫'],
  [/spajdl/, '🍢'],
  [/sol\b|koren|rasca|kmin|kurkum|skoric|kardamom|muskat/, '🧂'],
]

const FALLBACK = '🥄'

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

export function ingredientEmoji(item: string): string {
  const name = normalize(item)
  return RULES.find(([re]) => re.test(name))?.[1] ?? FALLBACK
}
