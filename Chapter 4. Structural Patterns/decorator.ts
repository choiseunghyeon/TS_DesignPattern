abstract class UIComponent {
  abstract draw(): void;
}

class Text {
  content: string;

  setColor(color: string): void {}
  setFont(font: string): void {}

  draw(): void {}
}

class TextComponent extends UIComponent {
  texts: Text[];

  draw(): void {
    for (let text of this.texts) {
      text.draw();
    }
  }
}

// 전통적인 데코레이터
class Decorator extends UIComponent {
  constructor(public component: TextComponent) {
    super();
  }

  get texts(): Text[] {
    return this.component.texts;
  }

  draw(): void {
    this.component.draw();
  }
}

class ColorDecorator extends Decorator {
  constructor(component: TextComponent, public color: string) {
    super(component);
  }

  draw(): void {
    for (let text of this.texts) {
      text.setColor(this.color);
    }

    super.draw();
  }
}

class FontDecorator extends Decorator {
  constructor(component: TextComponent, public font: string) {
    super(component);
  }

  draw(): void {
    for (let text of this.texts) {
      text.setFont(this.font);
    }

    super.draw();
  }
}

let decoratedComponent = new ColorDecorator(new FontDecorator(new TextComponent(), "sans-serif"), "black");

// ES 차세대 구문을 이용한 데코레이터
// 데코레이팅의 중첩 형태를 통해 직접 지정하는 전통적인 데코레이터 패턴에는 한계가 있다.

function prefix(target: Object, name: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  let method = descriptor.value as Function;

  if (typeof method !== "function") {
    throw new Error("Expecting decorating a method");
  }

  return {
    value: function () {
      return `[prefix] ` + method.apply(this, arguments);
    },
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
  };
}

function subfix(target: Object, name: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  let method = descriptor.value as Function;

  if (typeof method !== "function") {
    throw new Error("Expecting decorating a method");
  }

  return {
    value: function () {
      return method.apply(this, arguments) + " [suffix]";
    },
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
  };
}

class Foo {
  @prefix
  @subfix
  getContent(): string {
    return `...`;
  }
}
