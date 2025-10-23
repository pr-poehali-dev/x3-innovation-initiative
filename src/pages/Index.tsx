import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const PRIVILEGES = [
  { name: '🎖️ Бомж', minClick: 500, maxClick: 2500, required: 100000 },
  { name: '💰 Богач', minClick: 3000, maxClick: 5000, required: 1000000 },
  { name: '🏦 Миллионер', minClick: 5000, maxClick: 10000, required: 2000000 },
  { name: '🚀 Миллиардер', minClick: 10000, maxClick: 25000, required: 10000000 },
  { name: '⚡ Читер', minClick: 25000, maxClick: 50000, required: 25000000 },
  { name: '👑 VIP', minClick: 50000, maxClick: 100000, required: 50000000 },
  { name: '🎯 Хакер', minClick: 100000, maxClick: 250000, required: 100000000 },
  { name: '🌟 Бог', minClick: 250000, maxClick: 500000, required: 100000000 },
];

const BUSINESSES = [
  { id: 1, name: '24/7 бизнес', price: 500000, profit: 50000, emoji: '🏪' },
  { id: 2, name: 'Офис', price: 999999, profit: 75000, emoji: '🏢' },
  { id: 3, name: 'Компания ООО "Милиардеры"', price: 1500000, profit: 125000, emoji: '🏦' },
  { id: 4, name: 'Арбитраж команда с бюджетом в 5 МЛРД', price: 200000, profit: 25000, emoji: '💼' },
  { id: 5, name: 'Официальная лучшая работа с прибылью 50000/Сек', price: 500000, profit: 100000, emoji: '💎' },
];

export default function Index() {
  const { toast } = useToast();
  const [balance, setBalance] = useState(0);
  const [donateBalance, setDonateBalance] = useState(0);
  const [privilege, setPrivilege] = useState(PRIVILEGES[0]);
  const [ownedBusinesses, setOwnedBusinesses] = useState<number[]>([]);
  const [businessProfit, setBusinessProfit] = useState(0);
  const [lastClick, setLastClick] = useState(0);
  const [coinAnimation, setCoinAnimation] = useState(false);

  const formatNumber = (num: number) => {
    return num.toLocaleString('ru-RU');
  };

  const handleClick = () => {
    const now = Date.now();
    if (now - lastClick < 1000) {
      toast({
        title: '⏳ Подожди секунду!',
        description: 'Клики доступны раз в секунду',
        variant: 'destructive',
      });
      return;
    }

    const earned = Math.floor(Math.random() * (privilege.maxClick - privilege.minClick + 1)) + privilege.minClick;
    setBalance(prev => prev + earned);
    setLastClick(now);
    setCoinAnimation(true);
    setTimeout(() => setCoinAnimation(false), 300);

    toast({
      title: '💸 Заработано!',
      description: `+${formatNumber(earned)} монет`,
    });

    const newBalance = balance + earned;
    const newPrivilege = PRIVILEGES.slice().reverse().find(p => newBalance >= p.required);
    if (newPrivilege && newPrivilege.name !== privilege.name) {
      setPrivilege(newPrivilege);
      toast({
        title: '🎉 Новая привилегия!',
        description: `Теперь ты ${newPrivilege.name}`,
      });
    }
  };

  const buyBusiness = (business: typeof BUSINESSES[0]) => {
    if (balance < business.price) {
      toast({
        title: '❌ Недостаточно монет',
        description: `Нужно ${formatNumber(business.price)} монет`,
        variant: 'destructive',
      });
      return;
    }

    if (ownedBusinesses.includes(business.id)) {
      toast({
        title: '❌ Уже куплено',
        description: 'У тебя уже есть этот бизнес',
        variant: 'destructive',
      });
      return;
    }

    setBalance(prev => prev - business.price);
    setOwnedBusinesses(prev => [...prev, business.id]);
    setBusinessProfit(prev => prev + business.profit);
    
    toast({
      title: '🎉 Бизнес куплен!',
      description: `${business.emoji} ${business.name}`,
    });
  };

  const collectProfit = () => {
    if (businessProfit === 0) {
      toast({
        title: '❌ Нет бизнесов',
        description: 'Сначала купи бизнес',
        variant: 'destructive',
      });
      return;
    }

    setBalance(prev => prev + businessProfit);
    toast({
      title: '💰 Прибыль собрана!',
      description: `+${formatNumber(businessProfit)} монет`,
    });
  };

  const playCasino = (bet: number) => {
    if (balance < bet) {
      toast({
        title: '❌ Недостаточно монет',
        variant: 'destructive',
      });
      return;
    }

    const win = Math.random() < 0.4;
    if (win) {
      const winAmount = Math.floor(bet * 1.5);
      setBalance(prev => prev + winAmount - bet);
      toast({
        title: '🎰 Выигрыш!',
        description: `+${formatNumber(winAmount)} монет`,
      });
    } else {
      setBalance(prev => prev - bet);
      toast({
        title: '😢 Проигрыш',
        description: `-${formatNumber(bet)} монет`,
        variant: 'destructive',
      });
    }
  };

  const progressToNext = () => {
    const currentIndex = PRIVILEGES.indexOf(privilege);
    if (currentIndex === PRIVILEGES.length - 1) return 100;
    const nextPrivilege = PRIVILEGES[currentIndex + 1];
    return (balance / nextPrivilege.required) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            💸 GAMING BOT
          </h1>
          <p className="text-muted-foreground text-lg">Кликай, зарабатывай, развивайся!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6 space-y-4 bg-gradient-to-br from-card to-muted border-primary/20 animate-scale-in">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Баланс</p>
                <p className="text-3xl font-bold text-primary">{formatNumber(balance)} 💰</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Донат</p>
                <p className="text-2xl font-bold text-accent">{formatNumber(donateBalance)} 💎</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {privilege.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatNumber(privilege.minClick)} - {formatNumber(privilege.maxClick)} за клик
                </span>
              </div>
              <Progress value={progressToNext()} className="h-3" />
            </div>
          </Card>

          <Card className="p-6 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 animate-scale-in">
            <Button
              size="lg"
              onClick={handleClick}
              className={`text-6xl h-32 w-32 rounded-full bg-gradient-to-br from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl transition-all duration-300 ${
                coinAnimation ? 'animate-coin-pop' : ''
              } animate-pulse-glow`}
            >
              💸
            </Button>
          </Card>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="profile">👤 Профиль</TabsTrigger>
            <TabsTrigger value="business">🏢 Бизнес</TabsTrigger>
            <TabsTrigger value="casino">🎰 Казино</TabsTrigger>
            <TabsTrigger value="help">❓ Помощь</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">👤 Твой профиль</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground">ID игрока</p>
                  <p className="text-xl font-bold">#95E1D3</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Привилегия</p>
                  <p className="text-xl font-bold">{privilege.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Бизнесов</p>
                  <p className="text-xl font-bold">{ownedBusinesses.length} / 5</p>
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Доход в секунду</p>
                  <p className="text-xl font-bold text-accent">{formatNumber(businessProfit)} 💰</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">🏢 Магазин бизнесов</h2>
              <Button onClick={collectProfit} variant="outline" className="bg-accent/10">
                💰 Собрать прибыль
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {BUSINESSES.map(business => (
                <Card
                  key={business.id}
                  className={`p-6 space-y-4 transition-all duration-300 ${
                    ownedBusinesses.includes(business.id)
                      ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary'
                      : 'hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-3xl">{business.emoji}</p>
                      <p className="font-bold">{business.name}</p>
                    </div>
                    {ownedBusinesses.includes(business.id) && (
                      <Badge variant="secondary">✅ Куплено</Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Цена:</span>
                      <span className="font-bold text-secondary">{formatNumber(business.price)} 💰</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Доход/сек:</span>
                      <span className="font-bold text-accent">{formatNumber(business.profit)} 💰</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => buyBusiness(business)}
                    disabled={ownedBusinesses.includes(business.id)}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    {ownedBusinesses.includes(business.id) ? '✅ Куплено' : '💎 Купить'}
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="casino" className="space-y-4">
            <Card className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">🎰 Казино</h2>
                <p className="text-muted-foreground">Шанс выигрыша: 40% | Множитель: ×1.5</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[10000, 50000, 100000].map(bet => (
                  <Button
                    key={bet}
                    onClick={() => playCasino(bet)}
                    size="lg"
                    className="h-24 text-2xl bg-gradient-to-br from-destructive to-secondary hover:from-destructive/90 hover:to-secondary/90"
                  >
                    <div className="space-y-1">
                      <p>🎲 {formatNumber(bet)}</p>
                      <p className="text-sm">Выигрыш: {formatNumber(Math.floor(bet * 1.5))}</p>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="space-y-4">
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">❓ Команды и справка</h2>
              <div className="space-y-3">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-bold">💸 Клик</p>
                  <p className="text-sm text-muted-foreground">Основной заработок, зависит от привилегии</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-bold">🏢 Бизнесы</p>
                  <p className="text-sm text-muted-foreground">Покупай бизнесы для пассивного дохода</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-bold">🎰 Казино</p>
                  <p className="text-sm text-muted-foreground">Рискуй монетами для быстрого заработка</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-bold">🎖️ Привилегии</p>
                  <p className="text-sm text-muted-foreground">Растут автоматически при достижении баланса</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
